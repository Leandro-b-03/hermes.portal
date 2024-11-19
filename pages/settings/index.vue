<script setup lang="ts">
const router = useRouter();
const route = useRoute();
const shipperStore = useShipperStore();

const selectedMenu = computed(() => route.query.menu || 'details');
const shipper = computed(() => shipperStore.shipper);

const menu = ref([
  {
    label: 'settings.details',
    command: () => {
      changeQuery({ menu: 'details' });
    },
  },
  {
    label: 'settings.users',
    command: () => {
      changeQuery({ menu: 'users' });
    },
  },
  {
    label: 'settings.permissions',
    command: () => {
      changeQuery({ menu: 'permissions' });
    },
  }
]);

const changeQuery = (menu: {}) => {
  router.push({ query: menu });
};

onMounted(() => {
  routeContent(selectedMenu.value.toString());
});

  watch(() => selectedMenu.value, () => {
  routeContent(selectedMenu.value.toString());
});

const title = ref('');
const subtitle = ref('');

const routeContent = (value: string): void => {
  switch (value) {
    case 'details':
      title.value = 'settings.details.title';
      subtitle.value = 'settings.details.subtitle';
      break;
    case 'users':
      title.value = 'settings.users.title';
      subtitle.value = 'settings.users.subtitle';
      break;
    case 'permissions':
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
                <i class="pi pi-table text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t(title) }}</span>
              </div>
              <div>
                <NuxtLink to="/carriers/create" v-tooltip.top="$t('setup.options.add')" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
                  <i class="pi pi-plus"></i>
                </NuxtLink>
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t(subtitle) }}
            </div>
            <div>
              <PagesSettingsDetails v-if="selectedMenu === 'details'" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>