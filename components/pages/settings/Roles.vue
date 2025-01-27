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
const modules = computed(() => data.value?.modules);

onMounted(async () => {
  await roleStore.fetchData(query.value);
  await memberStore.fetchData(query.value);
});

const clickP = (permission: string, id: number, enable: boolean): void => {
  const data = new FormData();

  data.append('assign[permission][name]', permission);
  data.append('assign[permission][guard_name]', 'api');
  data.append('assign[user_id]', id.toString());

  if (permission === 'admin') {
    confirm.require({
      message: t('modules.settings.permission.confirmation'),
      header: t('common.are_you_sure'),
      rejectProps: {
          label: t('setup.buttons.cancel'),
          severity: 'secondary',
          outlined: true
      },
      acceptProps: {
          label: t('setup.buttons.continue'),
          severity: 'success'
      },
      accept: () => {
        if (!enable) {
          roleStore.assignRone(data).then(() => {
            $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.settings.permission.success.admin'), life: 5000 });
          }).catch((error) => {
            $toast.add({ severity: 'contrast', icon: 'pi-exclamation-triangle', success: false, summary: t('setup.error.title'), detail: t(error), life: 5000 });
          });
        } else {
          roleStore.revokeRole(data).then(() => {
            $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.settings.permission.success.revoke'), life: 5000 });
          }).catch((error) => {
            $toast.add({ severity: 'contrast', icon: 'pi-exclamation-triangle', success: false, summary: t('setup.error.title'), detail: t(error), life: 5000 });
          });
        }
      },
      reject: () => {
        console.log('cancel delete member', id);
      }
    });
  } else if (!enable) {
    roleStore.assignPermission(data).then(() => {
      $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.settings.permissions.success.assign'), life: 5000 });
    }).catch(() => {
      $toast.add({ severity: 'contrast', icon: 'pi-times', success: false, summary: t('setup.error'), detail: t('modules.settings.permissions.error'), life: 5000 });
    });
  } else {
    roleStore.revokePermission(data).then(() => {
      $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.settings.permissions.success.revoke'), life: 5000 });
    }).catch(() => {
      $toast.add({ severity: 'contrast', icon: 'pi-times', success: false, summary: t('setup.error'), detail: t('modules.settings.permissions.error'), life: 5000 });
    });
  }
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

const toggleColor = (module: any): string => {
  let trueCount = 0;
  for (const permission in module) {
    if (module[permission]) {
      trueCount++;
    }
  }

  let color = 'red'; // Default to red
  if (trueCount === Object.keys(module).length) {
    color = 'green'; // All permissions are true
  } else if (trueCount > 0) {
    color = 'yellow'; // Some permissions are true
  }

  return color;
};

// bg-red-300! hover:bg-red-400! bg-yellow-300! hover:bg-yellow-400! bg-green-300! hover:bg-green-400!
</script>

<style scoped>
/* // bg-red-300! hover:bg-red-400! bg-yellow-300! hover:bg-yellow-400! bg-green-300! hover:bg-green-400! */
</style>

<template>
  <ConfirmDialog></ConfirmDialog>
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
    <Column :header="$t('fields.admin')" :headerStyle="{text: 'center'}">
      <template #body="{ data }">
        <div class="flex justify-center">
          <div class="p-toggleswitch">
            <div class="rounded-full py-1 flex items-center cursor-pointer"
              :class="[
                data.roles[0].name === 'admin' ? 'bg-green-300 hover:bg-green-400 justify-end' : 'bg-gray-300 hover:bg-gray-400 justify-start',
              ]"
              @click="clickP('admin', data.id, data.roles[0].name === 'admin')">
              <div class="w-4 h-4 mx-1 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
      </template>
    </Column>
    <Column v-for="module in modules" :header="$t(`modules.settings.permissions.${module.title}.title`)" :headeStyle="{text: 'center'}">
      <template #body="{ data }">
        <div v-if="data.roles[0].name === 'admin'" class="flex justify-center">
          <div class="p-toggleswitch">
            <div class="rounded-full py-1 flex items-center bg-green-300 hover:bg-green-400 justify-end">
              <div class="w-4 h-4 mx-1 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
        </div>
        <div v-else class="flex justify-center">
          <div @click="openMenu(data.id, module.title)"
            class="p-toggleswitch">
            <div class="rounded-full py-1 flex items-center cursor-pointer"
            :class="[
                toggleColor(data.formatted_permissions[module.title]) === 'red' ? 'bg-red-300 hover:bg-red-400 justify-start' : '',
                toggleColor(data.formatted_permissions[module.title]) === 'green' ? 'bg-green-300 hover:bg-green-400 justify-end' : '',
                toggleColor(data.formatted_permissions[module.title]) === 'yellow' ? 'bg-yellow-300 hover:bg-yellow-400 justify-center' : '',
                // Add more conditions for other colors or a default class
              ]">
              <div class="w-4 h-4 mx-1 bg-white rounded-full shadow-lg"></div>
            </div>
          </div>
          <TransitionFade mode="in-out">
            <div :id="`${module.title}-${data.id}`" class="hidden animate-duration-500 min-w-10 min-h-16 bg-white rounded-lg shadow-lg pb-4 pt-2 px-4 mt-10 fixed z-50! border border-slate-300 overflow-hidden">
              <div class="flex flex-row justify-between items-center border-b border-slate-300 mb-2 py-2">
                <span class="font-medium text-base/3 mr-2">{{ $t('common.permissions_for') }}</span>
                <i class="pi pi-times cursor-pointer text-sm" @click="closeMenu(data.id, module.title)"></i>
              </div>
              <div v-for="permission in module.permissions" class="flex whitespace-nowrap mr-2 mb-1">
                <ToggleSwitch v-model="data.formatted_permissions[module.title][permission.name]" :name="permission.name" @click="clickP(permission.name, data.id, data.formatted_permissions[module.title][permission.name])" />
                <label :for="permission.name" class="ml-2">{{ $t(`modules.settings.permissions.${permission.name}`) }}</label>
              </div>
            </div>
          </TransitionFade>
        </div>
      </template>
    </Column>
  </DataTable>
</template>