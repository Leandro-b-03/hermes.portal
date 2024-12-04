<script setup lang="ts">
const route = useRoute();
const router = useRouter();
const importStore = useImportStore();
const carrierStore = useCarrierStore();
const t = useNuxtApp().$i18n.t;
const { $toast } = useNuxtApp();

const loading = computed(() => importStore.isLoading);
const carriersList = computed(() => carrierStore.carrierList);
const totalSize = ref(0);
const totalSizePercent = ref(0);
const files = ref([]);
const carrier = ref({});
const error = ref([]);
const chooseCallbackButton = ref();

const links = breadcrump(route.path);

onMounted(async () => {
  await carrierStore.getList();
});

const onSelectedFiles = (event) => {
  files.value = event.files;
  files.value.forEach((file) => {
    const validName = file.name.split('_');
    totalSize.value += parseInt(formatSize(file.size));
  });
};

const onRemoveTemplatingFile = (file, removeFileCallback, index) => {
    removeFileCallback(index);
    totalSize.value -= parseInt(formatSize(file.size));
    totalSizePercent.value = totalSize.value / 10;
};

const nameValid = (name: string, type: string) => {
  const validName = name.split('_');

  const acceptedTypes = ['pesado', 'leve', '167', '300'];
    
  if (validName.length !== 2 || !validName[1].includes('.csv') || !acceptedTypes.includes(validName[0])) {
    if (type !== 'row') {
      return `${name} - ${t('carriers.import.new.table.invalid_file')}`;
    } else {
      return true;
    }
  }

  if (type === 'type') {
    return `${validName[0]}`;
  } else if (type === 'name') {
    return `${validName[1].replace('.csv', '')}`;
  } else if (type === 'row') {
    return false;
  }
};

const rowClass = (data: any): any => {
  return [{ '!bg-red-500 !text-primary-contrast': nameValid(data.name, 'row') }];
};

const openWindow = (): void => {
  chooseCallbackButton.value.rootEl.click();
};

const submit = (): void => {
  const formData = new FormData();
  formData.append('carrier_id', carrier.value);
  files.value.forEach((file) => {
    formData.append('files[]', file);
  });

  importStore.scheduleImport(formData).then((response) => {
    $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.carriers.import.new.success'), life: 5000 });
    router.push('/carriers/import');
  }).catch((error) => {
    $toast.add({ severity: 'contrast', icon: 'pi-times', success: false, summary: t('setup.error'), detail: t('modules.carriers.import.new.error'), life: 5000 });
  });
}
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
                <i class="pi pi-upload text-surface-500 dark:text-surface-300 mr-2 text-xl" />
                <span class="text-xl font-medium text-surface-900 dark:text-surface-0">{{ $t('modules.carriers.import.new.title') }}</span>
              </div>
            </div>
            <div class="font-medium text-surface-500 dark:text-surface-300 mb-4">{{ $t('modules.carriers.import.new.description') }}
            </div>
            <div>
              <Fluid>
                <div class="grid grid-cols-12 gap-4">
                  <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-4">
                    <label class="block text-surface-500 dark:text-surface-300 font-medium mb-2"
                      for="carrier">{{ $t('modules.carriers.title') }}</label>
                    <Select v-model="carrier"
                            :options="carriersList"
                            filter
                            :filterFields="['name','tax_id']"
                            optionLabel="name"
                            option-value="id"
                            :placeholder="$t('fields.carrier_placeholder')"
                            :filterMessage="$t('fields.carrier_filter')"
                            :selectionMessage="$t('fields.carrier_empty')"
                            :emptySelectionMessage="$t('fields.carrier_empty')"
                            :emptyMessage="$t('fields.carrier_empty')"
                            :emptyFilterMessage="$t('fields.carrier_empty')"
                            class="w-full">
                        <template #option="{ option }">
                            <span>{{ `${option.name} - ${option.tax_id}` }}</span>
                        </template>
                      </Select>
                  </div>
                  <div class="mb-4 md:col-span-6 lg:col-span-4 xl:col-span-8"></div>
                  <div class="mb-4 col-span-12">
                    <label class="block text-surface-500 dark:text-surface-300 font-medium mb-2"
                      for="file">{{ $t('fields.files') }}</label>
                      <FileUpload name="files[]" url="/api/upload" :multiple="true" accept=".csv" :maxFileSize="1000000000" :fileLimit="10" @select="onSelectedFiles" class="w-full">
                        <template #header="{ chooseCallback, clearCallback, files }">
                            <div class="flex flex-wrap justify-between items-center flex-1 gap-4">
                              <div class="flex items-center gap-2">
                                <h5>{{ $t('modules.carriers.import.new.files') }}</h5>
                              </div>
                              <div class="flex gap-2">
                                  <Button @click="chooseCallback()" ref="chooseCallbackButton" icon="pi pi-file-excel" rounded outlined severity="secondary"></Button>
                                  <Button @click="clearCallback()" icon="pi pi-times" rounded outlined severity="danger" :disabled="!files || files.length === 0"></Button>
                              </div>
                            </div>
                        </template>
                        <template #content="{ files, removeUploadedFileCallback, removeFileCallback }">
                          <div class="flex flex-col gap-8 pt-4">
                            <div v-if="files.length > 0">
                              <div class="flex flex-wrap gap-4">
                                <DataTable :value="files" :rows="10" :rowClass="rowClass" class="w-full">
                                  <Column field="#">
                                    <template #body="{ data, index }">
                                      <span>{{ index + 1 }}</span>
                                    </template>
                                  </Column>
                                  <Column field="type" :header="$t('fields.type')">
                                    <template #body="{ data }">
                                      <span>{{ nameValid(data.name, 'type') }}</span>
                                    </template>
                                  </Column>
                                  <Column field="name" :header="$t('fields.name')">
                                    <template #body="{ data }">
                                      <span>{{ nameValid(data.name, 'name') }}</span>
                                    </template>
                                  </Column>
                                  <Column field="name" :header="$t('fields.file_name')"></Column>
                                  <Column field="size" :header="$t('fields.size')">
                                    <template #body="{ data }">
                                      <span>{{ formatSize(data.size) }}</span>
                                    </template>
                                  </Column>
                                  <Column :header="$t('common.actions')">
                                    <template #body="{ data }">
                                      <Button icon="pi pi-times" class="!bg-red-50 hover:!bg-red-100" @click="onRemoveTemplatingFile(data, removeFileCallback, index)" outlined rounded severity="danger" />
                                    </template>
                                  </Column>
                                </DataTable>
                              </div>
                            </div>
                          </div>
                        </template>
                        <template #empty="">
                          <div class="flex items-center justify-center flex-col cursor-pointer" @click="openWindow">
                            <i class="pi pi-cloud-upload !border-2 !rounded-full !p-8 !text-4xl !text-muted-color" />
                            <p class="mt-6 mb-0"></p>
                          </div>
                        </template>
                    </FileUpload>
                  </div>
                </div>
                <div class="flex flex-row justify-between">
                  <Button :label="$t('setup.buttons.save')" icon="pi pi-upload" class="!w-32" @click="submit" :loading="loading" />
                  <NuxtLink to="/carriers/import" class="!w-32">
                    <Button :label="$t('setup.buttons.cancel')" icon="pi pi-times" class="!w-32" />
                  </NuxtLink>
                </div>
              </Fluid>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>