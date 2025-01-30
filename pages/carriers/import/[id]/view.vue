<script setup lang="ts">
const route = useRoute();
const importStore = useImportStore();

const t = useNuxtApp().$i18n.t;

const loading = computed(() => importStore.isLoading);
const import_ = computed(() => importStore.carrierImport);
const rowsBy = ref(['cep_ini', 'cep_fim']);

const links = ref();

console.log(loading.value);

watch(import_, async () => {
  const breadcrumbs = computed(() => route.path.replace(/carriers\/import\/\d+\/view/, `carriers/import/name-${import_.value.file_name}/view`));
  links.value = breadcrump(breadcrumbs.value);
});

onMounted(async () => {
  await importStore.fetchDataById(route.params.id);
});

const labelSetup = (label: string, value: boolean = false): string => {
  switch (label) {
    case 'vigencia_inicio':
      return 'date_ini';
    case 'vigencia_fim':
      return 'date_end';
    case 'tipo_tabela':
    if (value) return 'freight_table';
      return 'freight_table.title';
    case 'empresa_cd':
    if (value) return 'company_type';
      return 'company_type.title';
    case 'alerta_qtd_meses_vencer':
      return 'alert';
    case 'cep_ini':
      return 'zip_ini';
    case 'cep_fim':
      return 'zip_end';
    case 'prazo_2':
      return 'days';
    case 'transportadora':
      return 'carrier';
    case 'tipo_veiculo':
      return 'vehicle_type';
    case 'qt_pedido_dia':
      return 'daily_order';
    case 'fator_cubagem':
      return 'cubing_factor';
    case 'tentativa_2':
      return 'attempt';
    case 'tipo_calculo':
      return 'calculation_type';
    case 'nivel_calculo':
      return 'calculation_level';
    case 'pedagio':
      return 'toll';
    case 'valor_quilo_excedente':
      return 'exceed_weight_value';
    case 'limite_embarque':
      return 'boarding_limit';
    case 'tipo_pedido':
      return 'order_type';
    default:
      return label;
  }
};

const valueSetup = (value: string, label: string): string => {
  const type = typeof value;
  if (type === 'string') {
    if (!isNaN(Number(value)) && (label.includes('empresa') || label.includes('tabela'))) { // Check if the string can be parsed as a number
      return t(`carriers.import.setup.${labelSetup(label, true) + `.${value}`}`);
    } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') { // Check for boolean strings
      return value === 'true' ? t('carriers.import.setup.yes') : t('carriers.import.setup.no');
    } else if (/^\d{2}\/\d{2}\/\d{4}$/.test(value)) { // Check for date format (dd/mm/yyyy)
      const [day, month, year] = value.split('/');
      const parsedDate = new Date(`${year}-${month}-${Number(day) + 1}`);
      return formatDate(parsedDate, false).toString();
    } else if (label.includes('valor') || label.includes('pedagio') || label.includes('frete') || label.includes('extra')) {
      return formatCurrency(value);
    } else if (label.includes('cep') || label.includes('cep')) {
      return formatZipCode(value);
    } else if (label.includes('ad_valorem') || label.includes('percentual') || label.includes('icms') || label.includes('iss') || label.includes('gris')) {
      return `${value}%`;
    } else {
      return value;
    }
  }
  
  return value;
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
        <div v-if="import_ != null || loading" class="bg-surface-0 dark:bg-surface-900 p-6 shadow rounded-border">
          <div class="mb-2 flex items-center justify-between">
            <div class="flex items-center">
              <Skeleton v-if="loading" height="1.6rem" width="300px" />
              <div v-else>
                <i class="pi pi-file-excel text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ import_?.file_name }}</span>
              </div>
            </div>
            <div>
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
              <Button :label="$t('setup.options.back')" icon="pi pi-arrow-left" class="!w-32" @click="$router.back()" />
            </div>
          </div>
          <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">
            <Skeleton v-if="loading" height="1.2rem" width="300px" />
            <span v-else>{{ $t('modules.carriers.import.view.description') }}</span>
          </div>
          <div>
            <div class="grid grid-cols-12 gap-4 grid-nogutter border-t border-surface pt-2">
              <div class="col-span-12 md:col-span-6 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.name') }}</div>
                <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ import_?.carrier.name }}</div>
              </div>
              <div class="col-span-12 md:col-span-6 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.tax_id') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ import_?.carrier.tax_id }}</div>
              </div>
              <div class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.uuid') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ import_?.uuid }}</div>
              </div>
              <div class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.status') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">
                  <Tag :value="import_?.imported_at ? $t('setup.status.1') : $t('setup.status.0')" :severity="import_?.imported_at ? 'success' : 'error'" />
                </div>
              </div>
              <div v-if="import_?.imported_at" class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.imported') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ formatDate(import_?.imported_at, true) }}</div>
              </div>
              <div v-if="import_?.error_at" class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.error') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ formatDate(import_?.error_at, true) }}</div>
              </div>
              <div v-if="import_?.error_at" class="col-span-12 p-4 border-t border-surface">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.error_message') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0 leading-normal">
                  {{ import_?.error_message }}
                </div>
              </div>
              <div class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.type') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ import_?.freight_type }}</div>
              </div>
              <div class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.model') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ import_?.freight_name }}</div>
              </div>
              <div class="col-span-12 md:col-span-4 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.size') }}</div>
                  <Skeleton v-if="loading" height="1.2rem" width="300px" />
                <div v-else class="text-surface-900 dark:text-surface-0">{{ formatSize(import_?.file_size) }}</div>
              </div>
              <Panel :header="$t('fields.setup.title')" toggleable class="col-span-12" collapsed>
                <div class="grid grid-cols-12 gap-4 grid-nogutter border-t border-surface pt-2">
                  <div class="col-span-12 p-4">
                    <div class="text-surface-500 dark:text-surface-300 font-medium mb-2"></div>
                    <div class="text-surface-900 dark:text-surface-0 leading-normal">
                      {{ $t('fields.setup.subtitle') }}
                    </div>
                  </div>
                  <div v-for="(value, key) in import_?.setup" class="col-span-12 md:col-span-4 p-4">
                    <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t(`fields.setup.${labelSetup(key)}`) }}</div>
                      <Skeleton v-if="loading" height="1.2rem" width="300px" />
                    <div v-else class="text-surface-900 dark:text-surface-0 leading-normal">
                      {{ valueSetup(value, key) }}
                    </div>
                  </div>
                </div>
              </Panel>
              <div class="col-span-12 p-4">
                <div class="text-surface-500 dark:text-surface-300 font-medium mb-4">{{ $t('fields.file') }}</div>
                <DataTable :value="import_?.rows" rowGroupMode="rowspan" :groupRowsBy="rowsBy" :loading="loading">
                  <Column field="#" header="#">
                    <template #body="{ data, index }">
                      <span>{{ index + 1 }}</span>
                    </template>
                  </Column>
                  <Column field="cep_ini" :header="$t('fields.zip_ini')" sortable>
                    <template #body="{ data }">
                      <span>{{ data.cep_ini ? formatZipCode(data.cep_ini) : '-' }}</span>
                    </template>
                  </Column>
                  <Column field="cep_fim" :header="$t('fields.zip_end')" sortable>
                    <template #body="{ data }">
                      <span>{{ data.cep_fim ? formatZipCode(data.cep_fim) : '-' }}</span>
                    </template>
                  </Column>
                  <Column field="prazo_2" :header="$t('fields.days')" sortable />
                  <Column field="peso_ini" :header="$t('fields.weight_ini')" sortable />
                  <Column field="peso_fim" :header="$t('fields.weight_end')" sortable />
                  <Column field="frete_peso" :header="$t('fields.price')" sortable>
                    <template #body="{ data }">
                      <span>{{ data.frete_peso ? formatCurrency(data.frete_peso) : '-' }}</span>
                    </template>
                  </Column>
                  <Column field="valor_extra_por_peso" :header="$t('fields.extra_per_weight')" sortable>
                    <template #body="{ data }">
                      <span>{{ data.valor_extra_por_peso ? formatCurrency(data.valor_extra_por_peso) : '-' }}</span>
                    </template>
                  </Column>
                  <Column field="faixa_quilo_excedente" :header="$t('fields.exceed_weight')" sortable>
                    <template #body="{ data }">
                      <span>{{ data.faixa_quilo_excedente ? data.faixa_quilo_excedente : '-' }}</span>
                    </template>
                  </Column>
                </DataTable>
              </div>
            </div>
          </div>
          <div class="flex justify-start mt-4">
            <Button :label="$t('setup.options.back')" icon="pi pi-arrow-left" class="!w-32" @click="$router.back()" />
          </div>
        </div>
        <PagesError v-if="!loading && import_ == null" :statusCode="500" title="carriers.import.error.404.title" message="carriers.import.error.404.message" />
      </div>
    </div>
  </div>
</div>
</template>