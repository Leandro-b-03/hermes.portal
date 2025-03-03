<script setup lang="ts">
const props = defineProps<{
  order: any;
  dialogOpen: boolean;
  statuses: [];
  showOrder: any;
}>();

const visible = props.dialogOpen;
const expandedRows = ref<any[]>([]);

const returnDate = (status: any): string => {
  if (!status) {
    return '-';
  }

  return formatDate(status.created_at, true);
};
</script>

<template>
  <Dialog v-model:visible="visible" modal :closable="false" :show-header="false" :breakpoints="{ '960px': '80vw', '640px': '96vw' }" :style="{ width: '50vw' }">
    <section class="flex flex-col w-full mt-6">
      <div class="flex w-full justify-between items-center mb-6">
        <span class="font-semibold text-base text-surface-600 dark:text-surface-200">{{ $t('common.order') }} <span class="text-surface-900 dark:text-surface-0">{{ order?.id }}</span></span>
        <Button type="button" icon="pi pi-times text-sm" rounded text severity="secondary" class="!w-8 !h-8 !text-surface-600 dark:!text-surface-200" @click="showOrder(null)" />
      </div>
      <div class="flex justify-between items-center w-full mb-6">
        <div class="flex flex-col">
          <p class="font-semibold text-xl mt-0 mb-0 text-surface-900 dark:text-surface-0"><span class="pi pi-truck !text-xl text-yellow-600" /> {{ $t('modules.orders.freight.view.title') }}</p>
          <p class="font-light text-xs text-surface-900 dark:text-surface-0">{{ $t('modules.orders.freight.view.description') }}</p>
        </div>
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
      </table>
      <div class="my-6">
        <Panel :header="$t('modules.orders.freight.view.general_order')" toggleable :collapsed="true">
          <table>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.id') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.id }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.quote_id') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.quote_id }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.business_unit') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.business_unit }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.service_type') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.service_type }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.order_type') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.order_type }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.freight_payment_type') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.freight_payment_type }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.shipping_provider') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.shipping_provider }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.handling_time_business_days') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.handling_time_business_days }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.extra_delivery_time_business_days') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.extra_delivery_time_business_days }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.preferred_index') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.preferred_index }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.client_type') }}</td>
              <td>
                <Tag :value="order?.order.client_type" severity="primary" />
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.cumulative_rules') }}</td>
              <td>
                <Tag :value="order?.order.cumulative_rules ? $t('common.yes') : $t('common.no')" :severity="order?.order.cumulative_rules ? 'success' : 'error'" />
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.rule_tags') }}</td>
              <td>
                <Tag v-for="rule in JSON.parse(order?.order.rule_tags)" :value="rule" severity="info" class="mr-2" />
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.sales_channel') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.sales_channel }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.session') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.session }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.order_id') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.order_id }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.ip') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.ip }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.page_name') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.page_name }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.url') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ order?.order.url }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.created_at') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ formatDate(order?.order.created_at, true) }}</span>
              </td>
            </tr>
            <tr class="h-10">
              <td class="font-medium text-base text-surface-600 dark:text-surface-200">{{ $t('fields.updated_at') }}</td>
              <td>
                <span class="font-medium text-base text-surface-900 dark:text-surface-0">{{ formatDate(order?.order.updated_at, true) }}</span>
              </td>
            </tr>
          </table>
        </Panel>
      </div>
      <div class="border-y border-surface py-6 my-6">
        <p class="font-medium text-lg text-surface-700 dark:text-surface-100 mt-0">Timeline</p>
        <Timeline :value="statuses" layout="horizontal" align="bottom">
          <template #opposite="slotProps">
            {{ $t(`modules.orders.view.kanban.${ slotProps.item.title }`) }}
          </template>
          <template #content="slotProps">
            <small class="text-surface-500 dark:text-surface-400">{{ returnDate(order?.status_orders.find((s) => s.status.name === slotProps.item.title)) }}</small>
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
            <Column field="quantity" header="Quantity">
              <template #body="{ data }">
                <span class="font-medium text-surface-900 dark:text-surface-50">{{ data.pivot.quantity }}</span>
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
                      <div class="flex flex-wrap px-4 py-3 justify-between">
                        <span class="block min-w-28 text-surface-600 dark:text-surface-200">{{ $t('fields.weight') }}</span>
                        <span class="block font-medium">{{ slotProps.data.weight }} kg</span>
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