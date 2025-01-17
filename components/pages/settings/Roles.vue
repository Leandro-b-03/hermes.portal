<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';
import { FilterMatchMode, FilterOperator } from '@primevue/core/api';

const { $toast } = useNuxtApp();
const authStore = useAuthStore();
const roleStore = useRoleStore();
const memberStore = useMemberStore();
const t = useNuxtApp().$i18n.t;
const confirm = useConfirm();
const route = useRoute();

const { required, minLength } = useI18nValidators();
const data = computed(() => roleStore.data);
const members = computed(() => memberStore.data);
const filters = ref({ name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] }});
const selectedMembers = ref([]);
const query = computed(() => new URLSearchParams(route.query).toString());
const loading = computed(() => roleStore.isLoading);
const edit = ref(false);
const roles = computed(() => data.value?.roles);
const modules = computed(() => data.value?.modules);
const role = ref({
  name: '',
  description: '',
  permissions: [],
});
const schema = {
  name: {
    required: required,
    minLength: minLength(3),
  },
};

const checkPermission = ref([]);

const v$ = useVuelidate(schema, role);

onMounted(async () => {
  await roleStore.fetchData(query.value);
  await memberStore.fetchData(query.value);  
});

const save = async (): Promise<void> => {
  v$.value.$validate().then(() => {
    if (v$.value.$error) {
      return;
    }
    // roleStore.save(role.value).then(() => {
    //   $toast.success(t('messages.success'));
    // });
  });
};

const changeRole = (name: string) => {
  edit.value = true;
  const selectedRole = roles.value.find((r: any) => r.name === name);
  role.value = { ...selectedRole };
  selectedRole.activeMenu = true;
  console.log('selectedRole', selectedRole);
};

const cancel = (): void => {
  edit.value = false;
  role.value = {
    name: '',
    description: '',
    permissions: [],
  };
};

// const checkPermission = (event: Event): void => {
//   console.log('event', event.target);
//   console.log('div 1', event.target.parentElement.children[0]);
//   console.log('Checkbox', event.target.parentElement.children[0].children[0]);

//   const checkbox = event.target.parentElement.children[0].children[0];
//   console.log('checkbox', checkbox.checked);
//   checkbox.checked = !checkbox.checked;
  // };

const clickP = (): void => {
  console.log('clickP');
  console.log('checkPermission', checkPermission);
};
</script>

<style>
.roles .p-menu-item {
  position: relative;
  left: -0.75rem;
}

@keyframes fadein-permissions {
    0% {
        opacity: 0;
    }
    100% {
        opacity: 1;
    }
}

@keyframes fadeout-permissions {
    0% {
        opacity: 1;
    }
    100% {
        opacity: 0;
    }
}

.fadein-permissions {
    animation: my-fadein 150ms linear;
}

.fadeout-permissions {
    animation: my-fadeout 150ms linear;
}
</style>

<template>
  <DataTable v-if="!loading" v-model:selection="selectedMembers" :value="members?.data" scrollable>
    <!-- <Column selectionMode="multiple" headerStyle="width: 3rem" frozen></Column> -->
    <Column class="z-50" field="name" :header="$t('fields.name')" frozen>
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
      <template #filter="{ filterModel }">
        <InputText v-model="filterModel.value" type="text" placeholder="Search by name" />
      </template>
    </Column>
    <Column v-for="module in modules" :header="$t(`modules.settings.permissions.${module.title}.title`)" :headeStyle="{text: 'center'}">
      <template #body="{ data }">
        <div class="flex justify-center">
          <div 
            v-styleclass="{
                selector: '@next',
                enterFromClass: 'hidden',
                enterActiveClass: 'fadein-permissions',
                leaveToClass: 'hidden',
                leaveActiveClass: 'fadeout-permissions',
                hideOnOutsideClick: true,
            }"
            class="p-toggleswitch">
            <div class="rounded-full py-1 hover:bg-slate-500! flex justify-start items-center bg-red-300 cursor-pointer hover:bg-red-400">
              <div class="w-4 h-4 ml-1 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
          <div class="hidden animate-duration-500 min-w-10 min-h-16 bg-white rounded-lg shadow-lg p-4 mt-10 fixed z-50! border border-slate-300 overflow-hidden">
            <div v-for="permission in module.permissions" class="flex whitespace-nowrap mr-2 mb-1">
              <ToggleSwitch v-model="checkPermission[permission.name]" :name="permission.name" @click="clickP" />
              <label :for="permission.name" class="ml-2" @click="checkPermission[permission.name] == !checkPermission[permission.name]">{{ $t(`modules.settings.permissions.${permission.name}`) }}</label>
            </div>
          </div>
        </div>
      </template>
    </Column>
  </DataTable>
  <!-- <div class="flex flex-row justify-between">
    <Menu :model="roles" class="!border-none roles">
      <template #start>
        {{ $t('modules.settings.permissions.roles') }}
      </template>
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center p-2 cursor-pointer" @click="changeRole(item.name)" :active="props.activeMenu">
          <span>{{ item.name }}</span>
        </a>
      </template>
    </Menu>
    <div class="grow py-2 px-4 ml-2">
      <div v-if="!edit">
        <span>Selecione um papel ao lado para editar suas permissões</span>
      </div>
      <div v-else>
        <div class="grid grid-cols-12 gap-4">
          <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4">
            <label for="name" class="font-medium text-surface-900 dark:text-surface-0 mb-1 block">{{ $t('fields.name') }}</label>
            <InputText v-model="role.name" id="name" type="text" class="w-full" :placeholder="$t('fields.name_roles_placeholder')" />
            <FieldError :errors="v$.name.$errors" :error="v$.name.$error" />
          </div>
          <div class="col-span-12"></div>
          <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4">
            <label for="description" class="font-medium text-surface-900 dark:text-surface-0 mb-1 block">{{ $t('fields.description') }}</label>
            <Textarea v-model="role.description" id="description" type="text" class="w-full" rows="5" cols="30" :placeholder="$t('fields.description_roles_placeholder')" />
          </div>
        </div>
        <div class="flex flex-wrap justify-start lg:justify-between gap-4 mb-4">
          <div v-for="module in permissions" class="border border-surface-200 dark:border-surface-700 rounded p-4 w-72">
            <h2 class="h2 mb-2">{{ $t(`modules.settings.permissions.${module.title}.title`) }}</h2>
            <div v-for="permission in module.permissions">
              <Checkbox :key="permission.name" :value="permission.name" :name="permission.name" />
              <label :for="permission.name" class="ml-2">{{ $t(`modules.settings.permissions.${permission.name}`) }}</label>
            </div>
          </div>
        </div>
        <div class="flex justify-between">
          <Button :label="$t('setup.buttons.cancel')" @click="cancel" />
          <Button :label="$t('setup.buttons.save')" @click="save" />
        </div>
      </div>
    </div>
  </div> -->
</template>