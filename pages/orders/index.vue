<script setup lang="ts">
import { PagesBreadcrump } from '#components';

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

const dialogOpen = ref(false);
const orderTrack = ref([
  'created',
  'approved',
  'waiting_for_invoice',
  'waiting_to_ship',
  'shipped',
  'delivered',
  'error_order'
]);

const order = ref(null);
const showOrder = (order: any): void => {
  dialogOpen.value = true;

  order.value = order;
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
            <div>
              <div class="flex flex-row gap-1">
                <div v-for="name in orderTrack" class="w-1/6 h-screen border border-surface-100 dark:border-surface-700 rounded overflow-hidden">
                  <div class="h-14 p-4" :class="name">
                    {{ $t(`modules.orders.view.kanban.${name}`) }}
                  </div>
                  <div class="bg-surface-100 dark:bg-surface-700 h-full p-2 shadow-inner dark:shadow-slate-800">
                    <TransitionScale mode="in-out">
                      <Skeleton v-if="loading" v-for="index in Math.floor(Math.random() * 5) + 1" class="mb-2 min-h-24" />
                      <div v-show="!loading" v-else class="flex flex-col gap-2">
                        <div v-for="order in orders?.data" class="bg-white dark:bg-surface-500 min-h-16 p-4 rounded shadow-sm dark:shadow-md overflow-hidden cursor-pointer" @click="showOrder(order)">
                          <span class="truncate w-4/6 inline-block text-lg">Frete No {{ order.id }}</span>
                          <ul class="list-disc ml-4">
                            <li class="text-xs truncate">Order ID: {{ order.order_id }}</li>
                            <li v-tooltip.top="order.order.quote_id" class="text-xs truncate">Quote ID: {{ order.order.quote_id }}</li>
                          </ul>
                        </div>
                      </div>
                    </TransitionScale>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="dialogOpen" :modal="false" :closable="false" :show-header="false" :breakpoints="{ '960px': '75vw', '640px': '96vw' }" :style="{ width: '45vw' }">
    <section class="flex flex-col w-full mt-6">
        <div class="flex w-full justify-between items-center mb-6">
            <span class="font-semibold text-base text-surface-600 dark:text-surface-200">Notes / <span class="text-surface-900 dark:text-surface-0">Daily</span></span>
            <Button type="button" icon="pi pi-times text-sm" rounded text severity="secondary" class="!w-8 !h-8 !text-surface-600 dark:!text-surface-200" @click="dialogOpen = false" />
        </div>
        <div class="flex justify-between items-center w-full mb-6">
            <p class="font-semibold text-xl mt-0 mb-0 text-surface-900 dark:text-surface-0"><span class="pi pi-bolt !text-xl text-yellow-600" /> Extend Functional Coverage</p>
            <Button type="button" icon="pi pi-pencil text-sm" roudned text class="!w-8 !h-8 !bg-surface-200 dark:!bg-surface-600 !text-surface-600 dark:!text-surface-200" />
        </div>
        <table>
            <tr class="h-10">
                <td class="font-medium text-base text-surface-600 dark:text-surface-200">Status</td>
                <td class="font-medium text-base text-surface-900 dark:text-surface-0">In Progress</td>
            </tr>
            <tr class="h-10">
                <td class="font-medium text-base text-surface-600 dark:text-surface-200">Assignee</td>
                <td>
                    <div class="flex items-center">
                        <img src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle/avatar-m-11.png" alt="Image" class="inline mr-2 h-6 w-6" />
                        <span class="font-medium text-base text-surface-900 dark:text-surface-0">John Walter</span>
                    </div>
                </td>
            </tr>
            <tr class="h-10">
                <td class="font-medium text-base text-surface-600 dark:text-surface-200">Due Date</td>
                <td class="font-medium text-base text-surface-900 dark:text-surface-0">Oct 21 at 2:00 PM</td>
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
            <p class="font-medium text-lg text-surface-700 dark:text-surface-100 mt-0">Description</p>
            <p class="text-base text-surface-900 dark:text-surface-0 mt-0 mb-0">
                Donec enim diam vulputate ut. Tellus mauris a diam maecenas. At varius vel pharetra vel turpis. Diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus. Amet luctus venenatis lectus magna fringilla urna porttitor rhoncus.
            </p>
        </div>
        <div class="flex flex-col">
            <div class="flex justify-between items-center w-full mb-3">
                <p class="font-medium text-lg text-surface-700 dark:text-surface-100 mt-0">Checklist</p>
                <span class="text-surface-500 dark:text-surface-300 flex items-center"><i class="pi pi-check-square text-lg mr-2" />1/4</span>
            </div>
            <div class="flex gap-2 mb-2 items-center">
                <Checkbox v-model="checked1" binary input-id="binary1" />
                <label for="binary">Placerat in egestas erat imperdiet.</label>
            </div>
            <div class="flex gap-2 mb-2 items-center">
                <Checkbox v-model="checked2" binary input-id="binary2" />
                <label for="binary">Cursus euismod quis viverra nibh.</label>
            </div>
            <div class="flex gap-2 mb-2 items-center">
                <Checkbox v-model="checked3" binary input-id="binary3" />
                <label for="binary">Malesuada fames ac turpis egestas integer eget.</label>
            </div>
            <div class="flex gap-2 mb-0 items-center">
                <Checkbox v-model="checked4" binary input-id="binary4" />
                <label for="binary">Nisl suscipit adipiscing bibendum est ultricies integer quis.</label>
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