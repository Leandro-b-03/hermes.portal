<script setup lang="ts">
import { PagesBreadcrump } from '#components';

const route = useRoute();
const router = useRouter();
const orderStore = useOrderStore();
const confirm = useConfirm();
const { $toast } = useNuxtApp();
const t = useNuxtApp().$i18n.t;

const loading = computed(() => orderStore.isLoading);
const orders = computed(() => orderStore.data);
const carriers = computed(() => orderStore.carriers);
const query = computed(() => new URLSearchParams(route.query).toString());
const links = breadcrump(route.path);
const expandedRows = ref({});
const statuses = computed(() => {
  if (!orders.value) {
    return;
  }

  // Extract the titles from the orders data
  const titles = Object.keys(orders.value); 

  return titles;
});
const items = ref([
  {
    items: [
      { label: 'export.all', icon: 'pi pi-fw pi-download', function: () => exportData() },
      { label: 'export.partial', icon: 'pi pi-fw pi-file-excel', function: () => exportCSV() }
    ]
  }
]);
const modal = ref({
  contactInfo: {
    open: false,
    data: null
  },
});
const dialogOpen = ref(false);
const order = ref(null);
const filter = ref('');
const stickyDiv = ref(null);
const fields = ref([
  'id',
  'quote_id',
  'shipper_id',
  'is_partner_order',
  'business_unit',
  'service_type',
  'order_type',
  'freight_payment_type',
  'shipping_provider',
  'handling_time_business_days',
  'extra_delivery_time_business_days',
  'preferred_index',
  'client_type',
  'cumulative_rules',
  'rule_tags',
  'sales_channel',
  'session',
  'order_id',
  'ip',
  'page_name',
  'url',
  'created_at',
  'updated_at',
  'order_freight.id',
  'order_freight.mode',
  'order_freight.origin_code',
  'order_freight.destination_code',
  'order_freight.carrier_id',
  'order_freight.product_id',
  'order_freight.weight',
  'order_freight.quantity',
  'order_freight.cubic_meters',
  'order_freight.cubic_weight',
  'order_freight.freight_cost_value',
  'order_freight.freight_cost_advalorem',
  'order_freight.freight_cost_gris',
  'order_freight.freight_cost_icms',
  'order_freight.freight_cost_iss',
  'order_freight.freight_cost_price_per_exceeded_weight',
  'order_freight.freight_cost_price_weight_fee',
  'order_freight.carrier_shipping_days',
  'order_freight.carrier_shipping_date',
  'order_freight.freight_customer_cost_value',
  'order_freight.freight_customer_cost_detail',
  'order_freight.customer_shipping_days',
  'order_freight.customer_shipping_date',
  'order_freight.created_at',
  'order_freight.updated_at'
]);
const actionItems = [
  {
    label: 'setup.buttons.edit',
    icon: 'pi pi-pencil',
    action: (event: Event, data: any) => router.push(`/orders/${data.id}/edit`),
    enabled: (data: any) => {
      return true; // Treat true as visible, false/undefined as not
    },
  },
  {
    label: 'setup.buttons.deactivate',
    icon: 'pi pi-times-circle',
    action: (event: Event, data: any) => deactivateMember(event, data.id),
    enabled: (data: any) => {
      return true; // Treat true as visible, false/undefined as not
    },
  },
];

onMounted(async () => {
  await orderStore.fetchData(query.value);
});

const exportData = async (): Promise<void> => {
  await carrierStore.export().then((response: any) => {
    const url = window.URL.createObjectURL(new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'carriers.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }).catch((error: any) => {
    console.error(error);
  });
};

const exportCSV = (): void => {
  dt.value.exportCSV();
};

const showOrder = (collection: any): void => {
  console.log(statuses);
  dialogOpen.value = !dialogOpen.value;

  order.value = collection;
};

const returnDate = (status: any): string => {
  if (!status) {
    return '-';
  }

  return formatDate(status.created_at, true);
};

const carrierFind = (id: number): string => {
  const carrier = carriers.value?.find((c: any) => c.id === id);

  return carrier ? carrier.name : '-';
};
</script>

<style>
.created {
  background-color: #50a82a;
  color: #fff;
}

.approved {
  background-color: #475fca;
  color: #fff;
}

.waiting_for_invoice {
  background-color: #38bbc6;
  color: #fff;
}

.waiting_to_ship {
  background-color: #3881a6;
  color: #fff;
}

.shipped {
  background-color: #286dae;
  color: #fff;
}

.delivered {
  background-color: #3aae89;
  color: #fff;
}

.error_order {
  background-color: #be2c2c;
  color: #fff;
}

.kanban .p-panel-content {
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  padding-bottom: 0.5rem;
}

.table-alt td {
  padding: var(--p-datatable-body-cell-padding-alt);
}
</style>

<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <PagesBreadcrump :links="links" :loading="loading" />

        <div class="bg-surface-50 dark:bg-surface-950 pt-2">
          <div class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border mb-2">
            <div class="mb-2 flex items-center justify-between">
              <div class="flex items-center">
                <i class="pi pi-table text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('modules.orders.title') }}</span>
              </div>
              <div>
                <NuxtLink to="/orders/create" v-tooltip.top="$t('setup.options.add')" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
                  <i class="pi pi-plus"></i>
                </NuxtLink>
                <Button v-tooltip.top="$t('setup.options.title')" icon="pi pi-ellipsis-v" text rounded @click="$refs.menu.toggle($event)" />
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
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('modules.orders.manage.description') }}
            </div>
            <div>
              <div class="flex justify-end">
                <div class="w-full lg:w-3/12">
                  <PagesSearchTable v-model:filter="filter" v-model:fields="fields" />
                </div>
              </div>
              <ConfirmDialog></ConfirmDialog>
              <!-- <DataTable :value="orders?.data" ref="dt" :loading="loading" sortMode="multiple" dataKey="carrier.id">
                <template #header>
                  <div v-if="orders?.data?.length > 0" class="flex justify-end">
                    <div class="w-30">
                      <PagesSearchTable v-model:filter="filter" v-model:fields="fields" />
                    </div>
                  </div>
                </template>
                <Column selectionMode="multiple" headerStyle="width: 3rem"></Column>
                <Column field="id" :header="$t('fields.id')" sortable></Column>
                <Column field="quote_id" :header="$t('fields.quote_id')" sortable class="" style="max-width: 75px">
                  <template #body="{ data }">
                    <div class="truncate w-full py-1 px-2 rounded !bg-surface-100 dark:bg-surface-900 z-[99]" @mouseenter="quoteId($event)" @mouseleave="quoteId($event)">
                      <span>{{ data.quote_id }}</span>
                    </div>
                  </template>
                </Column>
                <Column field="shipper_id" :header="$t('fields.shipper_id')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <span>{{ data.shipper_id }}</span>
                  </template>
                </Column>
                <Column field="business_unit" :header="$t('fields.business_unit')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <span>{{ data.business_unit }}</span>
                  </template>
                </Column>
                <Column field="service_type" :header="$t('fields.service_type')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <span>{{ data.service_type }}</span>
                  </template>
                </Column>
                <Column field="order_type" :header="$t('fields.order_type')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <span>{{ data.order_type }}</span>
                  </template>
                </Column>
                <Column field="freight_payment_type" :header="$t('fields.freight_payment_type')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <span>{{ data.freight_payment_type }}</span>
                  </template>
                </Column>
                <Column field="is_partner_order" :header="$t('fields.is_partner_order')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <Tag :value="data.is_partner_order ? $t('fields.yes') : $t('fields.no')" :severity="data.is_partner_order ? 'warn' : 'success'" />
                  </template>
                </Column>
                <Column field="order_id" :header="$t('fields.order_id')" sortable class="overflow-hidden">
                  <template #body="{ data }">
                    <span>{{ data.order_id }}</span>
                  </template>
                </Column>
                <Column class="min-w-32">
                  <template #body="{ data }">
                    <Button type="button" icon="pi pi-ellipsis-v" text severity="secondary" @click="$refs[`menu-${data.id}`].toggle($event)" v-tooltip.top="$t('common.actions')" />
                    <Menu :ref="`menu-${data.id}`" append-to="body" popup :model="actionItems" class="!min-w-full lg:!min-w-5">
                      <template #item="{ item, props }">
                        <NuxtLink v-if="item.enabled(data)" v-ripple class="flex items-center cursor-pointer p-menu-item p-menu-item-link" v-bind="props.action" @click="item.action($event, data)">
                          <i :class="item.icon" />
                          <span>{{ $t(item.label) }}</span>
                          <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                        </NuxtLink>
                      </template>
                    </Menu>
                  </template>
                </Column>
                <template #empty>{{ $t('setup.no_results') }}</template>
              </DataTable>
              <PagesPaginatorc v-if="orders?.total > 0" v-model:totalRecords="orders.total" v-model:rows="orders.per_page" v-model:first="orders.from" v-model:last="orders.last_page" /> -->
            </div>
          </div>
          <div class="bg-surface-0 dark:bg-surface-900 p-1 shadow rounded-border">
            <div ref="stickyDiv" class="w-full overflow-x-scroll overflow-y-hidden">
              <div class="flex gap-2 w-[2450px] h-[calc(100vh-90px)]">
                <div v-for="status in orders" class="w-[350px] max-h-[98%] border border-surface-100 dark:border-surface-700 rounded-border overflow-hidden flex flex-col">
                  <div class="h-14 p-4" :class="status.title">
                    {{ $t(`modules.orders.view.kanban.${status.title}`) }}
                  </div>
                  <div class="bg-surface-100 dark:bg-surface-700 p-2 shadow-inner dark:shadow-slate-800 !overflow-y-scroll flex flex-col gap-2 h-full">
                    <TransitionScale mode="in-out">
                      <Skeleton v-if="loading" v-for="index in Math.floor(Math.random() * 5) + 1" class="!h-[54px]" />
                      <div v-show="!loading" v-else class="flex flex-col gap-2">
                        <Panel v-for="item in status.items" toggleable class="!bg-surface-200 dark:!bg-surface-600 p-0 kanban" :header="item.quote_id" :key="item.id" :collapsed="true">
                          <template #header>
                            <strong v-tooltip.top="item.quote_id" class="truncate w-3/6">{{ item.quote_id }}</strong>
                          </template>
                          <div>
                            <ul class="p-2 mb-4 rounded">
                              <li class="text-xs">{{ item.freights[0].order.service_type }}</li>
                              <li class="text-xs">{{ item.freights[0].order.order_type }}</li>
                              <li class="text-xs">{{ item.freights[0].order.freight_payment_type }}</li>
                              <li class="text-xs">{{ item.freights[0].order.sales_channel }}</li>
                            </ul>
                          </div>
                          <div class="flex flex-col gap-2">
                            <div v-for="freight in item.freights" class="bg-white dark:bg-surface-500 hover:bg-slate-100 dark:hover:bg-surface-400 min-h-16 p-4 rounded shadow-sm dark:shadow-md overflow-hidden cursor-pointer" @click="showOrder(freight)">
                              <span class="truncate w-4/6 inline-block text-lg">{{ `${$t('fields.freight_id')} ${freight.id}` }}</span>
                              <table class="w-full">
                                <tr>
                                  <td class="text-sm" colspan="2"><i class="pi pi-map-marker text-xs"></i> {{ formatZipCode(freight.destination_code) }}</td>
                                </tr>
                                <tr>
                                  <td class="text-sm"><i class="pi pi-file text-xs"></i> {{ freight.order_id }}</td>
                                  <td class="text-sm">{{ formatCurrency(freight.freight_cost_value) }}</td>
                                </tr>
                                <tr>
                                  <td class="text-sm"><i class="pi pi-box text-xs"></i> {{ `${freight.weight}/${freight.cubic_meters}` }}</td>
                                  <td class="text-sm"><i class="pi pi-calendar text-xs"></i> {{ `${freight.carrier_shipping_days} ${$t('common.days')}` }}</td>
                                </tr>
                                <tr>
                                  <td class="text-sm" colspan="2"><i class="pi pi-truck text-xs"></i> {{ carrierFind(freight.carrier_id) }}</td>
                                </tr>
                              </table>
                            </div>
                          </div>
                        </Panel>
                      </div>
                    </TransitionScale>
                  </div>
                  <div class="w-full bg-surface-300 dark:bg-surface-600 p-2 text-center h-10">
                    Total in here: {{ status.items? Object.entries(status.items).reduce((total, [, item]) => total + (item.freights? Object.entries(item.freights).length: 0), 0): 0 }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="dialogOpen" :modal="false" :closable="false" :show-header="false" :breakpoints="{ '960px': '80vw', '640px': '96vw' }" :style="{ width: '45vw' }">
    <section class="flex flex-col w-full mt-6">
        <div class="flex w-full justify-between items-center mb-6">
          <span class="font-semibold text-base text-surface-600 dark:text-surface-200">{{ $t('common.order') }} <span class="text-surface-900 dark:text-surface-0">{{ order?.id }}</span></span>
          <Button type="button" icon="pi pi-times text-sm" rounded text severity="secondary" class="!w-8 !h-8 !text-surface-600 dark:!text-surface-200" @click="showOrder(null)" />
        </div>
        <div class="flex justify-between items-center w-full mb-6">
          <p class="font-semibold text-xl mt-0 mb-0 text-surface-900 dark:text-surface-0"><span class="pi pi-truck !text-xl text-yellow-600" /> {{ $t('modules.orders.freight.view.title') }}</p>
          <Button type="button" icon="pi pi-pencil text-sm" roudned text class="!w-8 !h-8 !bg-surface-200 dark:!bg-surface-600 !text-surface-600 dark:!text-surface-200" />
        </div>
        <table>
          <tr class="h-10">
            <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.status') }}</td>
            <td class="font-medium text-base text-surface-900 dark:text-surface-0"> {{ $t(`modules.orders.view.kanban.${ order?.status_orders[0].status.name }`) }}</td>
          </tr>
          <tr class="h-10">
            <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.zip_ini') }}</td>
            <td>
              <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ formatZipCode(order?.origin_code) }}</span>
            </td>
          </tr>
          <tr class="h-10">
            <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.zip_end') }}</td>
            <td>
              <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ formatZipCode(order?.destination_code) }}</span>
            </td>
          </tr>
          <tr class="h-10">
            <td class="font-medium text-base text-surface-600 dark:text-surface-200">Label</td>
            <td>
              <Tag severity="warn" class="mr-2">Product</Tag>
              <Tag severity="success">Quality</Tag>
            </td>
          </tr>
        </table>
        <div class="border-y border-surface py-6 my-6">
          <p class="font-medium text-lg text-surface-700 dark:text-surface-100 mt-0">Timeline</p>
          <Timeline :value="statuses" layout="horizontal" align="bottom">
            <template #opposite="slotProps">
              {{ $t(`modules.orders.view.kanban.${ slotProps.item }`) }}
            </template>
            <template #content="slotProps">
              <small class="text-surface-500 dark:text-surface-400">{{ returnDate(order?.status_orders.find((s) => s.status.name === slotProps.item)) }}</small>
            </template>
          </Timeline>
        </div>
        <div class="flex flex-col">
          <p class="font-medium text-lg text-surface-700 dark:text-surface-100 mt-0">Products</p>
          <div class="flex flex-col gap-4">
            <DataTable :value="order.products" :expanded-rows="expandedRows" responsive-layout="scroll" data-key="id" class="mb-4 table-alt" scrollable>
              <Column field="name" header="Product Name">
                <template #body="{ data }">
                  <div class="flex items-center min-w-48">
                    <div v-if="data.image == null" class="w-12 h-12 mr-4 flex items-center justify-center">
                      <i class="pi pi-barcode"></i>
                    </div>
                    <img v-else :src="data.image" :alt="data.name" class="w-12 h-12 mr-4 shadow-sm" />
                    <div>
                        <h3 class="font-sm text-surface-900 dark:text-surface-50">{{ data.name }}</h3>
                        <p class="font-sm text-surface-500 dark:text-surface-400">{{ data.description ? data.description : '-' }}</p>
                    </div>
                  </div>
                </template>
              </Column>
              <Column header="SKU">
                <template #body="{ data }">
                  <Tag :value="data.sku_id" severity="info" />
                </template>
              </Column>
              <Column header="EAN">
                <template #body="{ data }">
                  <Tag :value="data.ean" severity="info" />
                </template>
              </Column>
              <Column field="status" header="Categories">
                <template #body="{ data }">
                  <Chip v-for="category in JSON.parse(data.product_category)" :key="category" :label="category" class="mr-2" />
                </template>
              </Column>
              <Column field="total" header="Price">
                <template #body="{ data }">
                  <span class="font-medium text-surface-900 dark:text-surface-50">{{ formatCurrency(data.price) }}</span>
                </template>
              </Column>
              <Column expander style="width: 3rem" />
                <template #expansion="slotProps">
                  <div class="flex flex-col gap-4 rounded-lg my-2">
                      <div class="flex justify-between items-center p-3 bg-surface-50 dark:bg-surface-900 rounded-lg border border-surface overflow-hidden">
                          <div class="flex items-center">
                              <span class="block border border-surface rounded-lg w-8 h-8 mr-3">
                                <div v-if="slotProps.data.brandImage == null" class="flex justify-center items-center w-full h-full">
                                  <i class="pi pi-star-fill"></i>
                                </div>
                                <img v-else :src="slotProps.data.brandImage" :alt="slotProps.data.brand" class="w-full h-full rounded-lg" />
                              </span>

                              <div>
                                  <h3 class="text-surface-900 dark:text-surface-0">{{ slotProps.data.brand ? slotProps.data.brand : '-' }}</h3>
                              </div>
                          </div>
                          <div class="flex items-center gap-2">
                              <Button
                                  label="Follow"
                                  outlined
                                  size="small"
                                  class="!bg-surface-0 dark:!bg-surface-950 !text-surface-900 dark:!text-surface-50 !border !border-surface-200 dark:!border-surface-700 hover:!bg-surface-50 dark:hover:!bg-surface-900"
                              />
                              <Button label="Review" size="small" />
                          </div>
                      </div>
                      <div class="w-full bg-surface-50 dark:bg-surface-900 border border-surface rounded-lg overflow-hidden">
                          <div class="px-4 py-3 flex justify-between items-center bg-surface-50 dark:bg-surface-900 border-b border-surface">
                              <h4 class="font-semibold text-surface-700 dark:text-surface-200">{{ $t('common.product_info') }}</h4>
                              <div class="flex items-center gap-2">
                              </div>
                          </div>

                          <div class="rounded-lg bg-surface-0 dark:bg-surface-950">
                              <div class="flex flex-col">
                                  <div class="flex flex-wrap px-4 py-3 justify-between">
                                      <span class="block min-w-28 text-surface-600 dark:text-surface-200">{{ $t('fields.width') }}</span>
                                      <span class="block font-medium">{{ slotProps.data.width }} cm</span>
                                  </div>
                                  <div class="flex flex-wrap px-4 py-3 justify-between">
                                      <span class="block min-w-28 text-surface-600 dark:text-surface-200">{{ $t('fields.height') }}</span>
                                      <span class="block font-medium">{{ slotProps.data.height }} cm</span>
                                  </div>
                                  <div class="flex flex-wrap px-4 py-3 justify-between">
                                      <span class="block min-w-28 text-surface-600 dark:text-surface-200">{{ $t('fields.length') }}</span>
                                      <span class="block font-medium">{{ slotProps.data.length }} cm</span>
                                  </div>
                                  <span class="block h-px bg-surface-200 dark:bg-surface-700 mx-4" />
                                  <div class="flex flex-wrap px-4 py-3 justify-between">
                                      <span class="block min-w-28 text-surface-600 dark:text-surface-200">{{ $t('fields.cubic_weight') }}</span>
                                      <span class="block font-medium">{{ slotProps.data.cubic_weight }} m³</span>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
              </template>
          </DataTable>
          </div>
        </div>
    </section>
    <template #footer>
        <div class="flex w-full border-t pt-8 border-surface justify-end items-center">
            <Button icon="pi pi-check" label="Save" class="m-0" @click="visible = false" />
        </div>
    </template>
</Dialog>
</template>