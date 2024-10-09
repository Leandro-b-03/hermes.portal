<script setup lang="ts">
const route = useRoute();

const loading = ref(true);
console.log(route.path);
const links = breadcrump(route.path);

onMounted(() => {
  loading.value = false;
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
                <i class="pi pi-table text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('carriers.import.title')
                  }}</span>
              </div>
              <div>
                <NuxtLink to="/carriers/create" v-tooltip.top="$t('setup.options.add')" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
                  <i class="pi pi-plus"></i>
                </NuxtLink>
                <Button v-if="items" v-tooltip.top="$t('setup.options.title')" icon="pi pi-ellipsis-v" text rounded @click="$refs.menu.toggle($event)" />
                <Menu ref="menu" :popup="true" :model="items" >
                  <template #start>
                    <li class="pl-3 pt-3 list-none">
                      <span class="text-md font-semibold text-surface-500">{{ $t('setup.options.title') }}</span>
                    </li>
                  </template>
                  <template #item="{item, props}">
                    <li class="p-2 cursor-pointer" @click="item.function">
                      <i class="pi pi-fw text-surface-500 dark:text-surface-300 mr-2" :class="item.icon" />
                      <span class="text-surface-900 dark:text-surface-0">{{ $t(`setup.${item.label}`) }}</span>
                    </li>
                  </template>
                </Menu>
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('carriers.import.subtitle') }}
            </div>
            <div>
              <ConfirmDialog></ConfirmDialog>
              <DataTable :value="carriers?.data" ref="dt" :loading="loading" sortMode="multiple" dataKey="carrier.id">
              </DataTable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>