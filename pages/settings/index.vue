<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const shipperStore = useShipperStore();
const authStore = useAuthStore();
const t = useNuxtApp().$i18n.t;

const selectedMenu = ref('details');
const shipper = computed(() => shipperStore.shipper);
const editMode = ref(false);

const permissions = ref({
  shipper: {
    edit: false,
  },
  users: {
    edit: false,
  },
})

const menu = ref([
  {
    label: t('modules.settings.details.title'),
    command: () => {
      changeQuery({ menu: 'details' });
    },
  },
  {
    label: t('modules.settings.users.title'),
    command: () => {
      changeQuery({ menu: 'users' });
    },
  },
  {
    label: t('modules.settings.permissions.title'),
    command: () => {
      changeQuery({ menu: 'permissions' });
    },
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
});

watch(
  () => route.query.menu, 
  (newMenu, oldMenu) => {
    // Optional: Add validation or error handling for newMenu
    if (typeof newMenu === 'string') {
      selectedMenu.value = newMenu;
      routeContent(newMenu); 
    } else {
      // Handle the case where newMenu is not a string
      console.error('Invalid menu query parameter:', newMenu);
      // Optionally, set a default value for selectedMenu.value
    }
  }
);

const title = ref('');
const description = ref('');
const icon = ref('');

const routeContent = (value: string): void => {
  switch (value) {
    case 'details':
      icon.value = 'pi pi-info-circle';
      title.value = 'modules.settings.details.title';
      description.value = 'modules.settings.details.description';
      permissions.value.shipper.edit = authStore.hasPermission('Shipper.Editor');
      break;
    case 'users':
      icon.value = 'pi pi-users';
      title.value = 'modules.settings.users.title';
      description.value = 'modules.settings.users.description';
      break;
    case 'permissions':
      icon.value = 'pi pi-lock';
      title.value = 'modules.settings.permissions.title';
      description.value = 'modules.settings.permissions.description';
      break;
  }
}

const cancelEdit = () => {
  editMode.value = false;
}
</script>

<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <Menubar :model="menu" class="mt-4" />
        <div class="bg-surface-50 dark:bg-surface-950 pt-2">
          <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center">
                <i class="pi text-surface-500 dark:text-surface-300 mr-2 text-xl" :class="icon" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t(title) }}</span>
              </div>
              <div>
                <a v-if="selectedMenu !== 'details'" v-tooltip.top="$t('setup.options.add')" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
                  <i class="pi pi-plus"></i>
                </a>
                <Button v-if="selectedMenu === 'details' && permissions.shipper.edit" :disabled="editMode" v-tooltip.top="$t('setup.options.edit')" icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="editMode = !editMode" />
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t(description) }}
            </div>
            <div>
              <PagesSettingsDetails v-if="selectedMenu === 'details'" :edit="editMode" @cancel-edit="cancelEdit" />
              <PagesSettingsUsers v-if="selectedMenu === 'users'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>