<script setup lang="ts">
import order from '~/server/api/order';

const route = useRoute();
const router = useRouter();
const carrierStore = useCarrierStore();
const orderStore = useOrderStore();
const confirm = useConfirm();
const { $toast } = useNuxtApp();
 const t = useNuxtApp().$i18n.t;

const loading = computed(() => orderStore.isLoading);
const orders = computed(() => orderStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
const links = breadcrump(route.path);
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
const filter = ref('');
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

const quoteId = (event: Event): void => {
  const target = event.target as HTMLElement;
  if (target.classList.contains('truncate')) {
    target.classList.remove('truncate');
    if (target) {
      target.classList.add('shadow');
      target.style.width = `${target.scrollWidth + 8}px`;
    }
  } else {
    target.classList.add('truncate');
    target.classList.remove('shadow');
    target.style.width = `75px`;
  }
};
</script>

<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">{{ loading }}
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
              <ConfirmDialog></ConfirmDialog>
              <DataTable :value="orders?.data" ref="dt" :loading="loading" sortMode="multiple" dataKey="carrier.id">
                <template #header>
                  <div v-if="orders?.data?.length > 0" class="flex justify-end">
                    <div class="w-30">
                      <PagesSearchTable v-model:filter="filter" v-model:fields="fields" />
                    </div>
                  </div>
                </template>
                <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
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
              <PagesPaginatorc v-if="orders?.total > 0" v-model:totalRecords="orders.total" v-model:rows="orders.per_page" v-model:first="orders.from" v-model:last="orders.last_page" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>