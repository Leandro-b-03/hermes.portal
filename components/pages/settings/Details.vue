<script setup lang="ts">
const shipperStore = useShipperStore();

const props = defineProps<{
  edit: boolean;
}>();

const shipper = computed(() => shipperStore.shipper);
const showContactInfo = ref(false);

onMounted(() => {
  shipperStore.getShipper();
});
</script>

<template>
  <div class="grid grid-cols-12 gap-4 grid-nogutter border-t border-surface pt-2">
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('settings.details.company') }}</div>
      <div class="text-surface-900 dark:text-surface-0">{{ `${shipper?.name}/${shipper?.fantasy_name}` }}</div>
    </div>
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('setup.tax_id') }}</div>
      <div class="text-surface-900 dark:text-surface-0">{{ shipper?.tax_id }}</div>
    </div>
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('settings.details.address_complete') }}</div>
      <div class="text-surface-900 dark:text-surface-0">{{ `${shipper?.address}, ${shipper?.number} - Complemento: ${shipper?.address_2 ? shipper?.address_2 : '-'}, ${shipper?.address_3} - ${shipper?.state}, ${shipper?.country} - ${shipper?.zip_code}` }}</div>
    </div>
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('settings.details.contact_name') }}</div>
      <div class="text-surface-900 dark:text-surface-0 cursor-pointer" @click="showContactInfo = true">{{ shipper?.contact_name }}</div>
    </div>
    <div class="col-span-12 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('settings.details.matrix.title') }}</div>
      <div class="text-surface-900 dark:text-surface-0 leading-normal">{{ shipper?.shipper_matrix_id ? $t('settings.details.matrix.branch ') : $t('settings.details.matrix.matrix') }}</div>
    </div>
  </div>

  <Dialog v-model:visible="showContactInfo" modal :header="$t('settings.details.contact.header')" class="min-w-[30rem]">
    <ul class="list-none p-0 m-0 border-t border-surface">
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.name') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">{{ shipper?.contact_name }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.contact_title') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12 leading-normal">{{ shipper?.contact_title }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.department') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">{{ shipper?.contact_department }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.email') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
                <a :href="`mailto:${shipper?.contact_email}`" target="_blank"><Tag class="mr-2" :value="shipper?.contact_email" :rounded="true" /></a>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.phone') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
            <Tag :value="`${shipper?.contact_phone}`" severity="info" :rounded="true" />
          </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.mobile') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
            <Tag :value="`${shipper?.contact_mobile}`" severity="success" :rounded="true" />
          </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full md:w-2/12 font-medium">{{ $t('carriers.index.contact_info.fax') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full md:w-10/12">
            <Tag :value="`${shipper?.contact_fax}`" severity="warning" :rounded="true" />
          </div>
        </li>
    </ul>
  </Dialog>
</template>