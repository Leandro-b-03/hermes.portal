<script setup lang="ts">
import { PagesBreadcrump } from '#components';
import { setBlockTracking } from 'vue';

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
const settings = ref(false);
const statuses = ref<{ title: string; visible: boolean; }[]>([]);
const items = ref([
  {
    items: [
      { label: 'export.all', icon: 'pi pi-fw pi-download', function: () => exportData() },
      { label: 'export.partial', icon: 'pi pi-fw pi-file-excel', function: () => exportCSV() },
      { separator: true },
      { label: 'buttons.settings', icon: 'pi pi-cog', function: () => openSettings() }
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
  statusSet(orders.value);
});

const statusSet = (data: any): void => {
  if (!orders.value) {
    return;
  }

  if(localStorage.orders_statuses) {
    statuses.value = JSON.parse(localStorage.orders_statuses as string);
    return;
  }

  const titles = Object.keys(orders.value).map(title => ({ title, visible: true }));

  statuses.value = titles;
};

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
  dialogOpen.value = !dialogOpen.value;

  order.value = collection;
};

const carrierFind = (id: number): string => {
  const carrier = carriers.value?.find((c: any) => c.id === id);

  return carrier ? carrier.name : '-';
};

const openSettings = (): void => {
  settings.value = true;
};

const initialStatuses = ref([]);

const handleToggle = (status: { title: string; visible: boolean }): void => {
  const visibleCountBeforeToggle = statuses.value.filter(s => s.visible).length;

  if (visibleCountBeforeToggle === 2 && status.visible) {
    // Prevent toggle if only two are left and the user tries to turn one off
    status.visible = true; // Revert to true to prevent toggle.
    $toast.add({ severity: 'contrast', icon: 'pi-exclamation-triangle', summary: t('common.warning'), detail: t('modules.orders.view.kanban.messages.2_cols_warning'), life: 3000 });
    return;
  }

  // Update the status visibility
  status.visible = !status.visible;

  saveConfig();
};

watch(settings, (newValue) => {
  if (newValue) {
    // When the dialog opens, store the initial state
    initialStatuses.value = statuses.value.map(status => ({ ...status }));
  }
});

const saveConfig = (): void => {
  setTimeout(() => {
    const visibleStatuses = statuses.value.filter(status => status.visible).length;

    if (visibleStatuses < 2) {
      $toast.add({ severity: 'contrast', icon: 'pi-exclamation-triangle', summary: t('common.warning'), detail: t('modules.orders.view.kanban.messages.2_cols_warning'), life: 3000 });
      // Restore the initial state if less than 2 are visible after the change.
      statuses.value = initialStatuses.value.map(status => ({ ...status }));
      return;
    }

    localStorage.orders_statuses = JSON.stringify(statuses.value);
  }, 300);
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
            </div>
          </div>
          <div class="bg-surface-0 dark:bg-surface-900 p-1 shadow rounded-border">
            <div ref="stickyDiv" class="w-full overflow-x-scroll overflow-y-hidden">
              <div :class="statuses.filter(s => s.visible).length <= 6 ? 'w-full' : 'w-[2450px]'" class="">
                <transition-fade group class="flex gap-2 h-[calc(100vh-90px)]">
                  <div v-for="status in orders" :key="status.title"
                    v-show="statuses?.find((s) => s.title == status.title)?.visible" 
                    :class="{
                      'w-1/6': statuses.filter(s => s.visible).length >= 6,
                      'w-2/6': statuses.filter(s => s.visible).length >= 3 || statuses.filter(s => s.visible).length <= 5,
                      'w-3/6': statuses.filter(s => s.visible).length === 2
                    }"
                    class="max-h-[98%] border border-surface-100 dark:border-surface-700 rounded-border overflow-hidden flex flex-col">
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
                    {{ `${$t('modules.orders.view.kanban.total_items')} ${status.items? Object.entries(status.items).reduce((total, [, item]) => total + (item.freights? Object.entries(item.freights).length: 0), 0): 0}` }}
                    </div>
                  </div>
                </transition-fade>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <PagesOrdersInfo :visible="dialogOpen" :order="order" :showOrder="showOrder" :statuses="statuses" />
  <Dialog v-model:visible="settings" modal :header="$t('common.settings')" :style="{ width: '25rem' }">
    <span class="text-surface-500 dark:text-surface-400 block mb-8">{{ $t('modules.orders.view.settings.description') }}</span>
    <div v-for="status in statuses" :key="status.title" class="flex items-center justify-between mb-4">
      <span class="text-surface-900 dark:text-surface-0">{{ $t(`modules.orders.view.kanban.${status.title}`) }}</span>
      <ToggleSwitch :defaultValue="status.visible" @click="handleToggle(status)" />
    </div>
  </Dialog>
</template>