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

const clickP = (): void => {
  console.log('clickP');
  console.log('checkPermission', checkPermission);
};

const openMenu = (id: number, title: string): void => {
  const menu = document.getElementById(`${title}-${id}`);
  if (menu) {
    menu.classList.toggle('hidden');
    menu.classList.add('fadein');
  }
};

const closeMenu = (id: number, title: string): void => {
  const menu = document.getElementById(`${title}-${id}`);
  if (menu) {
    menu.classList.toggle('hidden');
    menu.classList.add('fadeout');
  }
};

const toggleColor = (permissions: any, id: number, title: string): string => {
  const permission = permissions.find((permission: any) => permission.module === title);
  return permission?.permission ? 'bg-green-300 hover:bg-green-400' : 'bg-red-300 hover:bg-red-400';
};
</script>

<template>
  <DataTable v-if="!loading" v-model:selection="selectedMembers" :value="members?.data" scrollable>
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
          <div @click="openMenu(data.id, module.title)"
            class="p-toggleswitch">
            <div class="rounded-full py-1 hover:bg-slate-500! flex justify-start items-center cursor-pointer" :class="toggleColor(data.permissions, data.id, module.title)">
              <div class="w-4 h-4 ml-1 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
          <TransitionFade mode="in-out">
            <div :id="`${module.title}-${data.id}`" class="hidden animate-duration-500 min-w-10 min-h-16 bg-white rounded-lg shadow-lg pb-4 pt-2 px-4 mt-10 fixed z-50! border border-slate-300 overflow-hidden">
              <div class="flex flex-row justify-between items-center border-b border-slate-300 mb-2 py-2">
                <span class="font-medium text-base/3 mr-2">{{ $t('common.permissions_for') }}</span>
                <i class="pi pi-times cursor-pointer text-sm" @click="closeMenu(data.id, module.title)"></i>
              </div>
              <div v-for="permission in module.permissions" class="flex whitespace-nowrap mr-2 mb-1">
                <ToggleSwitch v-model="data.permissions[module.title][permission.name]" :name="permission.name" @click="clickP" />
                <label :for="permission.name" class="ml-2" @click="checkPermission[permission.name] == !checkPermission[permission.name]">{{ $t(`modules.settings.permissions.${permission.name}`) }}</label>
              </div>
            </div>
          </TransitionFade>
        </div>
      </template>
    </Column>
  </DataTable>
</template>