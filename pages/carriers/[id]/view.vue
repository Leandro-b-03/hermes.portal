<script setup lang="ts">
const route = useRoute();
const carrierStore = useCarrierStore();

const loading = computed(() => carrierStore.isLoading);
const carrier = computed(() => carrierStore.carrier);
const view = ref(true);

onMounted(async () => {
  await carrierStore.getCarrier(Number(route.params.id));
});

const links = ref();

watch(carrier, () => {
  const breadcrumbs = computed(() => route.path.replace(/carriers\/\d+\/view/, `carriers/name-${carrier.value.name}/view`));
  links.value = breadcrump(breadcrumbs.value);

  loading.value = false;
});
</script>

<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <PagesBreadcrump :links="links" :loading="loading" />

        <div class="bg-surface-50 dark:bg-surface-950 pt-2">
          <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center">
                <i class="pi pi-truck text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('modules.carriers.view.title')
                  }}</span>
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('modules.carriers.view.description') }}
            </div>
            <div>
              <PagesCarriersForm v-model:carrier="carrier" v-model:view="view" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>