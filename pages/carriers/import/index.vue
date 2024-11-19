<script setup lang="ts">
const route = useRoute();
const importStore = useImportStore();

const items = ref(false);

const loading = computed(() => importStore.isLoading);
const carriers = computed(() => importStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
const expandedRows = sessionStorage.getItem('expandedRows') ? ref(JSON.parse(sessionStorage.getItem('expandedRows'))) : ref({});
const links = breadcrump(route.path);
const filter = route.query.filter?.toString() || '';
const fields = ref([
  'tax_id',
  'name',
  'freight_type',
  'file_name',
  'file_path',
  'file_size',
  'error_on_import',
  'error_message',
  'imported_at',
  'error_at',
  'created_at',
  'updated_at',
]);

onMounted(async () => {
  await importStore.fetchData(query.value);
});

watch(() => route.query, async () => {
  await importStore.fetchData(query.value);
});

const onRowExpand = (event) => {
  sessionStorage.setItem('expandedRows', JSON.stringify(expandedRows.value));
};

const onRowCollapse = (event) => {
  sessionStorage.setItem('expandedRows', JSON.stringify(expandedRows.value));
};

console.log('expandedRows', expandedRows.value);
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
                <NuxtLink to="/carriers/import/new" v-tooltip.top="$t('setup.options.add')" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
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
              <DataTable :value="carriers?.data" v-model:expandedRows="expandedRows" @rowExpand="onRowExpand" @rowCollapse="onRowCollapse" ref="dt" :loading="loading" sortMode="multiple" dataKey="id">
                <template #header>
                  <div v-if="carriers?.data?.length > 0" class="flex justify-end">
                    <div class="w-30">
                      <PagesSearchTable v-model:filter="filter" v-model:fields="fields" />
                    </div>
                  </div>
                </template>
                <Column expander style="width: 5rem" />
                <Column field="tax_id" :header="$t('setup.tax_id')" sortable />
                <Column field="name" :header="$t('setup.name')" sortable />
                <Column field="carrier_freight_table" :header="$t(`carriers.import.qtd_csv`)">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.carrier_freight_table.length }}</span>
                  </template>
                </Column>
                <template #expansion="slotProps">
                  <div class="p-4">
                    <DataTable :value="slotProps.data.carrier_freight_table" rowGroupMode="rowspan" groupRowsBy="uuid">
                      <column header="#">
                        <template #body="slotProps">
                          <i class="pi" :class="(slotProps.data.error_on_import && !slotProps.data.imported_at) ? 'pi-exclamation-triangle text-red-500' : slotProps.data.imported_at ? 'pi-check text-green-500' : 'pi-hourglass text-yellow-600'"></i>
                        </template>
                      </column>
                      <Column field="uuid" :header="$t('carriers.fields.uuid')" sortable></Column>
                      <Column field="freight_type" :header="$t('carriers.fields.freight_type')" sortable></Column>
                      <Column field="freight_name" :header="$t('carriers.fields.freight_name')" sortable></Column>
                      <Column field="file_name" :header="$t('carriers.fields.file_name')" sortable></Column>
                      <Column field="created_at" :header="$t('carriers.fields.created_at')" sortable></Column>
                      <Column field="updated_at" :header="$t('carriers.fields.created_at')" sortable></Column>
                      <Column>
                        <template #body="slotProps">
                          <NuxtLink :to="`/carriers/import/${slotProps.data.id}/view`" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
                            <Button v-tooltip.top="$t('setup.tables.view')" icon="pi pi-eye" text rounded />
                          </NuxtLink>
                        </template>
                      </Column>
                    </DataTable>
                  </div>
              </template>
                <template #empty>{{ $t('setup.no_results') }}</template>
              </DataTable>
              <PagesPaginatorc v-if="carriers.total > 0" v-model:totalRecords="carriers.total" v-model:rows="carriers.per_page" v-model:first="carriers.from" v-model:last="carriers.to" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>