<script setup lang="ts">
import Members from '~/components/pages/settings/Members.vue';

const router = useRouter();
const route = useRoute();
const authStore = useAuthStore();
const t = useNuxtApp().$i18n.t;

const selectedMenu = ref('details');
const editMode = ref(false);
const title = ref('');
const description = ref('');
const icon = ref('');
const notAllowed = ref(false);
const transition = ref(false);
const permissions = ref({
  shipper: {
    read: true,
    edit: false,
  },
  members: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
  permissions: {
    create: false,
    read: false,
    update: false,
    delete: false,
  },
});
const menu = ref([
  {
    label: t('modules.settings.details.title'),
    command: () => {
      changeQuery({ menu: 'details' });
    },
  },
  {
    label: t('modules.settings.members.title'),
    command: () => {
      changeQuery({ menu: 'members' });
    },
    visible: computed(() => permissions.value.members.read),
  },
  {
    label: t('modules.settings.permissions.title'),
    command: () => {
      changeQuery({ menu: 'permissions' });
    },
    visible: computed(() => permissions.value.permissions.read),
  }
]);


const changeQuery = (menu: {}) => {
  router.push({ query: menu });
};

onMounted(() => {
  if (!!route.query.menu) {
    selectedMenu.value = route.query.menu as string;
  }

  routeContent(selectedMenu.value);
  permissionsLoad();
});

watch(
  () => route.query.menu, 
  (newMenu, oldMenu) => {
    transition.value = true;
    // Optional: Add validation or error handling for newMenu
    if (typeof newMenu === 'string') {
      selectedMenu.value = newMenu;
      routeContent(newMenu); 
    } else {
      // Handle the case where newMenu is not a string
      console.error('Invalid menu query parameter:', newMenu);
      // Optionally, set a default value for selectedMenu.value
    }

    setTimeout(() => {
      transition.value = false;
    }, 200);
  }
);

const routeContent = (value: string): void => {
  switch (value) {
    case 'details':
      icon.value = 'pi pi-info-circle';
      title.value = 'modules.settings.details.title';
      description.value = 'modules.settings.details.description';
      break;
    case 'members':
      icon.value = 'pi pi-users';
      title.value = 'modules.settings.members.title';
      description.value = 'modules.settings.members.description';
      break;
    case 'permissions':
      icon.value = 'pi pi-lock';
      title.value = 'modules.settings.permissions.title';
      description.value = 'modules.settings.permissions.description';
      break;
  }
}

const permissionsLoad = () => {
  permissions.value.shipper.edit       = authStore.hasPermission('shipper.update');
  permissions.value.members.create     = authStore.hasPermission('auth.create');
  permissions.value.members.read       = authStore.hasPermission('auth.read');
  permissions.value.members.update     = authStore.hasPermission('auth.update');
  permissions.value.members.delete     = authStore.hasPermission('auth.delete');
  permissions.value.permissions.create = authStore.hasPermission('permissions.create');
  permissions.value.permissions.read   = authStore.hasPermission('permissions.read');
  permissions.value.permissions.update = authStore.hasPermission('permissions.update');
  permissions.value.permissions.delete = authStore.hasPermission('permissions.delete');

  Object.keys(permissions.value).forEach((key) => {
    if (key === selectedMenu.value) {
      if (permissions.value[key].read !== true) {
        notAllowed.value = true;
      }
    }
  });
}

const cancelEdit = () => {
  editMode.value = false;
}
</script>

<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <Menubar v-if="!notAllowed" :model="menu" class="mt-0" />
        <TransitionFade group>
          <div v-if="transition" class="h-[500px] w-full flex items-center justify-center">
            <div class="loading-container">
              <div class="loading-ring"></div>
            </div>
          </div>
          <div v-else-if="!notAllowed" class="bg-surface-50 dark:bg-surface-950 pt-2">
            <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
              <div class="mb-2 flex items-center justify-between">
                <div class="flex items-center">
                  <i class="pi text-surface-500 dark:text-surface-300 mr-2 text-xl" :class="icon" />
                  <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t(title) }}</span>
                </div>
                <div>
                  <Button v-if="selectedMenu === 'details' && permissions.shipper.edit" :disabled="editMode" v-tooltip.top="$t('setup.options.edit')" icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="editMode = !editMode" />
                </div>
              </div>
              <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t(description) }}
              </div>
              <div>
                <PagesSettingsDetails v-if="selectedMenu === 'details'" :edit="editMode" @cancel-edit="cancelEdit" />
                <PagesSettingsMembers v-if="selectedMenu === 'members'" />
                <PagesSettingsPermissions v-if="selectedMenu === 'permissions'" />
              </div>
            </div>
          </div>
          <PagesError v-if="notAllowed" :statusCode="403" title="setup.error.403.title" message="setup.error.403.message" />
        </TransitionFade>
      </div>
    </div>
  </div>
</template>