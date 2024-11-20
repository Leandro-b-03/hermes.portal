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
    label: t('settings.details.title'),
    command: () => {
      changeQuery({ menu: 'details' });
    },
  },
  {
    label: t('settings.users.title'),
    command: () => {
      changeQuery({ menu: 'users' });
    },
  },
  {
    label: t('settings.permissions.title'),
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

watch(() => !!route.query.menu, () => {
  selectedMenu.value = route.query.menu as string;
  routeContent(selectedMenu.value);
});

const title = ref('');
const subtitle = ref('');
const icon = ref('');

const routeContent = (value: string): void => {
  switch (value) {
    case 'details':
      icon.value = 'pi pi-info-circle';
      title.value = 'settings.details.title';
      subtitle.value = 'settings.details.subtitle';
      permissions.value.shipper.edit = authStore.hasPermission('Shipper.Editor');
      break;
    case 'users':
      icon.value = 'pi pi-users';
      title.value = 'settings.users.title';
      subtitle.value = 'settings.users.subtitle';
      break;
    case 'permissions':
      icon.value = 'pi pi-lock';
      title.value = 'settings.permissions.title';
      subtitle.value = 'settings.permissions.subtitle';
      break;
  }
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
                <Button v-if="selectedMenu === 'details' && permissions.shipper.edit" v-tooltip.top="$t('setup.options.edit')" icon="pi pi-pencil" class="p-button-rounded p-button-text" @click="editMode = !editMode" />
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t(subtitle) }}
            </div>
            <div>
              <PagesSettingsDetails v-if="selectedMenu === 'details'" :edit="editMode" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>