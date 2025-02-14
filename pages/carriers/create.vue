<script setup lang="ts">
const route = useRoute();
const loading = ref(true);

const links = breadcrump(route.path);

onMounted(() => {
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
                <i class="pi pi-plus text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('modules.carriers.create.title')
                  }}</span>
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('modules.carriers.create.description') }}
            </div>
            <div>
              <PagesCarriersForm />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>