<script setup lang="ts">
const { $toast } = useNuxtApp();
const memberStore = useMemberStore();
const t = useNuxtApp().$i18n.t;
const confirm = useConfirm();
const route = useRoute();

const members = computed(() => memberStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
const loading = computed(() => memberStore.isLoading);
const newMember = ref(false);
const emailsText = ref('');
const emails = ref<string[]>([]);
const error = ref({
  email: false,  
  message: '',
});
const paginate = ref({
  total: computed(() => members.value ? members.value.total : 0),
  per_page: computed(() => members.value ? members.value.per_page : 10),
  from: computed(() => members.value ? members.value.from : 0),
  to: computed(() => members.value ? members.value.to : 0),
});
const items = [
  {
    label: 'setup.buttons.edit',
    route: 'edit',
    icon: 'pi pi-pencil',
    action: (event, id: number) => editMember(id),
  },
  {
    label: 'setup.buttons.deactivate',
    route: 'deactivate',
    icon: 'pi pi-user-minus',
    action: (event, id: number) => deactivateMember(event, id),
  },
];
const filter = route.query.filter?.toString() || '';
const fields = ref([
  'name',
  'email',
  'created_at',
  'updated_at'
]);

onMounted(async () => {
  await memberStore.fetchData(query.value); 
});

watch(
  () => route.query, // Watch route.query for changes
  async (newQuery, oldQuery) => {
    if (newQuery !== oldQuery) {
      await memberStore.fetchData(new URLSearchParams(newQuery).toString()); 
    }
  }
);


const editMember = (id: number): void => {
  console.log('Edit member', id);
};

const deactivateMember = (event: Event, id: number): void => {
  confirm.require({
    message: 'Are you sure you want to proceed?',
    header: 'Confirmation',
    rejectProps: {
        label: 'Cancel',
        severity: 'secondary',
        outlined: true
    },
    acceptProps: {
        label: 'Delete',
        severity: 'danger'
    },
    accept: () => {
      console.log('delete member', id);
    },
    reject: () => {
      console.log('cancel delete member', id);
    }
  });
  console.log('Deactivate member', id);
};

const validateEmail = () => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  error.value.email = !emailRegex.test(emailsText.value); 
};

const addEmail = (): void => {
  const invalid_email = t('modules.settings.members.invite.error.invalid_email')
  const email_exists = t('modules.settings.members.invite.error.email_exists')

  if (error.value.email) {
    error.value.message = invalid_email;
    return;
  }

  const emailsTextValue = emailsText.value.trim();

  if (!error.value.email && !emails.value.includes(emailsTextValue)) { 
    emails.value.push(emailsTextValue);
    emailsText.value = '';
    error.value.email = false; 
  } else {
    error.value.email = true;
    console.log(emails.value.includes(emailsTextValue));
    if (emails.value.includes(emailsTextValue)) {
      error.value.message = email_exists;
    } else {
      error.value.message = invalid_email;
    }
  }
};

const removeEmail = (index: number): void => {
  emails.value.splice(index, 1);
};

const inviteMember = (): void => {
  if (emails.value.length === 0) {
    error.value.email = true;
    error.value.message = t('modules.settings.members.invite.error.empty_email');
    return;
  }

  const formData = new FormData();

  emails.value.forEach((email) => {
    formData.append('users[]', email);
  });

  memberStore.invite(formData).then(() => {
    newMember.value = false;
    emails.value = [];
    $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.settings.members.invite.create.success'), life: 5000 });
  }).catch((error) => {
    console.log(error);
    $toast.add({ severity: 'contrast', icon: 'pi-exclamation-triangle', success: false, summary: t('setup.error'), detail: error.message, life: 5000 });
  });
};
</script>

<template>
  <ConfirmDialog></ConfirmDialog>
  <section class="flex flex-wrap gap-4 py-12 justify-between border-t border-surface">
    <div class="flex-shrink-0 w-60">
      <h3 class="mb-6 mt-0 text-surface-900 dark:text-surface-0 font-medium text-xl">{{ $t('modules.settings.members.title_2') }}</h3>
      <p class="mb-6 mt-0 text-surface-700 dark:text-surface-100 font-normal text-base">{{ $t('modules.settings.members.description_2') }}</p>
      <Button :label="$t('setup.buttons.invite')" class="w-auto" @click="newMember = true"/>
    </div>
    <div class="overflow-x-scroll">
      <DataTable :value="members?.data" row-hover :loading="loading" selectionMode="single">
        <template #header>
          <div v-if="members?.data?.length > 0" class="flex justify-end">
            <div class="w-30">
              <PagesSearchTable v-model:filter="filter" v-model:fields="fields" />
            </div>
          </div>
        </template>
        <Column class="min-w-[25rem]">
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.name') }}</span>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-4">
              <Avatar v-if="data.user_info.photo_url" :image="data.user_info.photo_url" class="mr-2 overflow-hidden" size="large" />
              <Avatar v-else icon="pi pi-user" class="mr-2" style="background-color: #ece9fc; color: #2a1261" size="large" />
              <div>
                <p class="mt-0 mb-3 font-medium text-base/3 text-color-primary">
                  {{ data.name }}
                </p>
                <p class="mt-2 font-normal text-muted-color text-xs/3">
                  {{ data.email }}
                </p>
              </div>
            </div>
          </template>
        </Column>
        <Column class="min-w-56">
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.joined_at') }}</span>
          </template>
          <template #body="{ data }">
            <p class="mt-0 font-normal text-base text-muted-color">
              {{ formatDate(data.created_at) }}
            </p>
          </template>
        </Column>
        <Column class="min-w-[13rem]">
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.last_active_at') }}</span>
          </template>
          <template #body="{ data }">
            <p class="mt-0 font-normal text-base text-muted-color">
              {{ formatDate(data.updated_at, true) }}
            </p>
          </template>
        </Column>
        <Column>
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.active') }}</span>
          </template>
          <template #body="{ data }">
            <Badge :value="data.active ? $t('fields.active') : $t('fields.inactive')" :severity="data.active ? 'success' : 'danger'" />
          </template>
        </Column>
        <Column class="min-w-32">
          <template #body="{ data }">{{ data.id }}
            <Button type="button" icon="pi pi-ellipsis-v" text severity="secondary" @click="$refs[`menu-${data.id}`].toggle($event)" :data-id="data.id" />
            <Menu :ref="`menu-${data.id}`" append-to="body" popup :model="items" class="!min-w-full lg:!min-w-5">
              <template #item="{ item, props }">
                <NuxtLink v-ripple class="flex items-center cursor-pointer p-menu-item p-menu-item-link" v-bind="props.action" @click="item.action($event, data.id)">
                  <i :class="item.icon" />
                  <span>{{ $t(item.label) }}</span>
                  <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                </NuxtLink>
              </template>
            </Menu>
          </template>
        </Column>
      </DataTable>
      <PagesPaginatorc v-if="paginate.total > 0" v-model:totalRecords="paginate.total" v-model:rows="paginate.per_page" v-model:first="paginate.from" v-model:last="paginate.to" />
    </div>
  </section>
  <Dialog v-model:visible="newMember" maximizable modal :header="$t('modules.settings.members.invite.title')" :style="{ width: '50rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div>
      <p class="text-base text-surface-700 dark:text-surface-100 mb-2">{{ $t('modules.settings.members.invite.description') }}</p>
      <div class="w-full lg:w-96 min-h-16 mb-2">
        <InputGroup>
          <InputText v-model="emailsText" @keyup="validateEmail" class="w-full" placeholder="Emails" @keyup.enter="addEmail" :invalid="error.email" />
          <Button icon="pi pi-plus" class="!rounded-r-md" @click="addEmail" />
        </InputGroup>
        <small v-if="error.email" class="text-red-500 text-xs mt-1 w-full">{{ error.message }}</small>
      </div>
      <div class="min-h-10 border-dashed border mb-4 p-1">
        <TransitionFade group>
          <Chip v-for="(email, index) in emails" :key="index" :label="email" removable @remove="removeEmail(index)" class="!py-1 !px-2" />
        </TransitionFade>
      </div>
    </div>
    <div class="flex justify-between gap-2">
      <Button type="button" label="Save" @click="inviteMember"></Button>
      <Button type="button" label="Cancel" severity="secondary" @click="newMember = false"></Button>
    </div>
  </Dialog>
</template>