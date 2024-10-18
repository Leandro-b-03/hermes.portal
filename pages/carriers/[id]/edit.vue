<script setup lang="ts">
const route = useRoute();
const carrierStore = useCarrierStore();

const loading = computed(() => carrierStore.isLoading);
const carrier = computed(() => carrierStore.carrier);

onMounted(async () => {
  await carrierStore.getCarrier(Number(route.params.id));
});

const links = ref();

watch(carrier, () => {
  const breadcrumbs = computed(() => route.path.replace(/carriers\/\d+\/edit/, `carriers/name-${carrier.value.name}/edit`));
  links.value = breadcrump(breadcrumbs.value);
});
</script>

<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <Transition name="fade" mode="out-in">
          <Skeleton v-if="loading" height="3.4rem" class="rounded-none" />
          <ul v-else
            class="list-none p-0 m-0 bg-surface-0 dark:bg-surface-900 flex font-medium overflow-y-hidden overflow-x-auto">
            <li v-for="(link, index) in links" :key="index" class="relative p-4">
              <PagesBreadcrump :name="link" :index="index" />
            </li>
          </ul>
        </Transition>

        <div class="bg-surface-50 dark:bg-surface-950 pt-2">
          <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center">
                <i class="pi text-surface-500 dark:text-surface-300 mr-2 text-xl" :class="route.params.id ? 'pi-pencil' : 'pi-plus'" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('carriers.edit.title')
                  }}</span>
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('carriers.edit.subtitle') }}
            </div>
            <div>
              <PagesCarriersForm v-model:carrier="carrier" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>