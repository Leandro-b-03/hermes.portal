<script setup lang="ts">

const route = useRoute();
const router = useRouter();
const carrierStore = useCarrierStore();
const confirm = useConfirm();
const { $toast } = useNuxtApp();
const t = useNuxtApp().$i18n.t;

const loading = computed(() => carrierStore.isLoading);
const carriers = computed(() => carrierStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
// const selectedData = ref();
const dt = ref();
const filter = route.query.filter?.toString() || '';
const fields = ref([
  'tax_id',
  'name',
  'address',
  'address_2',
  'city',
  'state',
  'country',
  'zip',
  'carrierContact.name',
  'carrierContact.phone',
  'carrierContact.email',
  'carrierContact.fax',
  'carrierContact.mobile',
  'carrierContact.title',
  'carrierContact.department',
  'created_at',
  'updated_at',
]);

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

onMounted(async () => {
  await carrierStore.fetchData(query.value);
});

watch(() => route.query, async () => {
  await carrierStore.fetchData(query.value);
});

const getSeverity = (status: string): string => {
  if (status === 'Pending') return 'warning';
  if (status === 'Active') return 'success';
  if (status === 'Inactive') return 'danger';
  return 'info';
};

const getSeverityB = (status: boolean): string => {
  if (status) return 'success';
  return 'danger';
};

const showContactInfo = (carrier: any): void => {
  modal.value.contactInfo.open = true;
  modal.value.contactInfo.data = carrier;
};

const edit = (id: number): void => {
  router.push({ path: `/carriers/${id}/edit` });
};

const exportData = async (): Promise<void> => {
  await carrierStore.export().then((response: any) => {
    console.log(response);
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

const deleteCarrier = (id: number): void => {
  confirm.require({
    message: t('carriers.index.delete.subtitle'),
    header: t('carriers.index.delete.title'),
    icon: 'pi pi-info-circle',
    rejectLabel: t('setup.options.cancel'),
    rejectProps: {
      label: t('setup.options.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('setup.options.delete'),
      severity: 'danger'
    },
    accept: () => {
      carrierStore.delete(id).then((response) => {
        console.log(response);
        if (response) {
          $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('carriers.index.delete.message.success_header'), detail:  t('carriers.index.delete.message.success'), life: 3000 });
        } else {
          $toast.add({ severity: 'contrast', icon: 'pi-times-circle', summary: t('carriers.index.delete.message.error_header'), detail:  t('carriers.index.delete.message.error'), life: 3000 });
        }
      }).catch((error) => {
        $toast.add({ severity: 'contrast', icon: 'pi-times-circle', summary: t('carriers.index.delete.message.error_header'), detail:  t('carriers.index.delete.message.error'), life: 3000 });
      });
    }
  });
};
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
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('carriers.index.title')
                  }}</span>
              </div>
              <div>
                <NuxtLink to="/carriers/create" v-tooltip.top="$t('setup.options.add')" class="p-button p-component p-button-icon-only p-button-rounded p-button-text ripple">
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
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('carriers.index.subtitle') }}
            </div>
            <div>
              <ConfirmDialog></ConfirmDialog>
              <DataTable :value="carriers?.data" ref="dt" :loading="loading" sortMode="multiple" dataKey="carrier.id">
                <template #header>
                  <div v-if="carriers?.data?.length > 0" class="flex justify-end">
                    <div class="w-30">
                      <PagesSearchTable v-model:filter="filter" v-model:fields="fields" />
                    </div>
                  </div>
                </template>
                <!-- <Column selectionMode="multiple" headerStyle="width: 3rem"></Column> -->
                <Column field="name" :header="$t(`carriers.index.table.name`)">
                  <template #body="slotProps">
                    <NuxtLink :to="`/carriers/${slotProps.data.id}/view`">{{ slotProps.data.name }}</NuxtLink>
                  </template>
                </Column>
                <Column field="tax_id" :header="$t(`carriers.index.table.tax_id`)">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.tax_id }}</span>
                  </template>
                </Column>
                <Column field="address" :header="$t(`carriers.index.table.address`)">
                  <template #body="slotProps">
                    <span class="cursor-pointer"
                    v-tooltip.top="slotProps.data.address + ', ' + slotProps.data.number + ', ' + slotProps.data.address_2 + ' - ' + slotProps.data.address_3 + ', ' + slotProps.data.city + ' - ' + slotProps.data.state + ', ' + slotProps.data.zip">
                      {{ slotProps.data.address }}
                    </span>
                  </template>
                </Column>
                <Column field="zip" :header="$t(`carriers.index.table.zip`)">
                  <template #body="slotProps">
                    <span>{{ slotProps.data.zip }}</span>
                  </template>
                </Column>
                <Column field="carrier_contact.name" :header="$t(`carriers.index.table.contact_name`)">
                  <template #body="slotProps">
                    <span class="cursor-pointer" @click="showContactInfo(slotProps.data.carrier_contact[0])">{{ slotProps.data.carrier_contact[0].name }}</span>
                  </template>
                </Column>
                <Column field="carrier_shipper.active" :header="$t(`carriers.index.table.status`)">
                  <template #body="slotProps">
                    <Badge :severity="getSeverityB(slotProps.data.carrier_shipper[0].active)" :value="$t(`setup.status.${slotProps.data.carrier_shipper[0].active}`)" />
                  </template>
                </Column>
                <Column field="updated_at" :header="$t(`carriers.index.table.updated_at`)">
                  <template #body="slotProps">
                    {{ formatDate(slotProps.data.updated_at, true) }}
                  </template>
                </Column>
                <Column :header="$t(`carriers.index.table.actions`)">
                  <template #body="slotProps">
                    <Button v-tooltip.left="$t('setup.options.edit')" icon="pi pi-pencil" class="mr-2" @click="edit(slotProps.data.id)" />
                    <Button v-tooltip.right="$t('setup.options.delete')" icon="pi pi-trash" class="mr-2" @click="deleteCarrier(slotProps.data.id)" />
                  </template>
                </Column>
                <template #empty>{{ $t('setup.no_results') }}</template>
              </DataTable>
              <PagesPaginatorc v-if="carriers.total > 0" v-model:totalRecords="carriers.total" v-model:rows="carriers.per_page" v-model:first="carriers.from" v-model:last="carriers.to" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="modal.contactInfo.open" maximizable modal :header="$t('carriers.index.contact_info.title')" :style="{ width: '45rem' }" :breakpoints="{ '1199px': '75vw', '575px': '90vw' }">
    <div class="font-medium text-3xl text-surface-900 dark:text-surface-0 mb-4">{{ modal.contactInfo.data.name }}</div>
    <div class="text-surface-500 dark:text-surface-300 mb-8">{{ `${$t('setup.tax_id')}: ${modal.contactInfo.data.tax_id}` }} </div>
    <ul class="list-none p-0 m-0 border-t border-surface">
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.name') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">{{ modal.contactInfo.data.name }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.contact_title') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12 leading-normal">{{ modal.contactInfo.data.title }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.department') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">{{ modal.contactInfo.data.department }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.email') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
                <a :href="`mailto:${modal.contactInfo.data.email}`" target="_blank"><Tag class="mr-2" :value="modal.contactInfo.data.email" :rounded="true" /></a>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.phone') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
            <Tag :value="`${modal.contactInfo.data.phone}`" severity="info" :rounded="true" />
          </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.mobile') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
            <Tag :value="`${modal.contactInfo.data.mobile}`" severity="success" :rounded="true" />
          </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.fax') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
            <Tag :value="`${modal.contactInfo.data.fax}`" severity="warning" :rounded="true" />
          </div>
        </li>
    </ul>
  </Dialog>
</template>