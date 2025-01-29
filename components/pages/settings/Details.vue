<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';

const shipperStore = useShipperStore();
const t = useNuxtApp().$i18n.t;
const { $toast } = useNuxtApp();

const props = defineProps<{
  edit: boolean;
}>();

const { required, email, sameAs, minLength } = useI18nValidators();
const shipperLoad = computed(() => shipperStore.shipper);
const loading = computed(() => shipperStore.isLoading);
const showContactInfo = ref(false);
const zipLoading = ref(false);
const transition = ref(false);
const uploadMouseover = ref(false);
const disabled = ref({
  address: true,
});
const logo = ref(File);
const shipper = reactive({});
const schema = computed(() => {
  return {
    name: { 
      required: required,
      minLength: minLength(3),
    },
    commercial_name: { 
      required: required,
      minLength: minLength(3),
    },
    address: { 
      required: required,
    },
    address_3: { 
      required: required,
      minLength: minLength(3),
    },
    number: { 
      required: required,
      minLength: minLength(1),
    },
    city: { 
      required: required,
      minLength: minLength(2),
    },
    state: { 
      required: required,
      minLength: minLength(2),
    },
    zip_code: { 
      required: required,
      minLength: minLength(8),
    },
    country: { 
      required: required,
      minLength: minLength(3),
    },
    contact_name: {
      required: required,
      minLength: minLength(3),
    },
    contact_email: { 
      required: required,
      email: email,
    },
    contact_title: { 
      required: required,
      minLength: minLength(2),
    },
    contact_department: { 
      required: required,
      minLength: minLength(2),
    },
    contact_mobile: { 
      required: required,
      minLength: minLength(10),
    },
  };
});
const v$ = useVuelidate(schema, shipper);

await shipperStore.getUserShipper();

transformReactive(shipperLoad.value, shipper);

watch(() => props.edit, () => {
  transition.value = true;

  transformReactive(shipperLoad.value, shipper);

  setTimeout(() => {
    transition.value = false;
  }, 500);
});

const zipValidation = async (): Promise<any> => {
  if (shipper.zip_code.length === 9) {
    zipLoading.value = true;
    const data = loadZipCode(shipper.zip_code);

    disabled.value.address = true;

    if (data !== null) {
      shipper.address = data.value.logradouro;
      shipper.address_3 = data.value.bairro;
      shipper.city = data.value.localidade;
      shipper.state = data.value.uf;
      shipper.country = 'Brasil';
    } else {
      disabled.value.address = false;
    }
  }
}

const emit = defineEmits(['cancelEdit']);

const openFileUpload = (): void => {
  const input = document.querySelector('input[type="file"]') as HTMLInputElement;
  input.click();
}

const changeLogo = (event: Event): void => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];

  if (file) {
    logo.value = file;
  }
}

const save = async (): Promise<any> => {
  v$.value.$validate().then(() => {
    if (v$.value.$error) {
      return;
    }

    const formData = toFormData(shipper, 'shipper');

    if (logo.value.name !== 'File') {
      formData.append('shipper[logo]', logo.value);
      formData.delete('shipper[logo_image_url]');
    }

    shipperStore.update(formData).then((response) => {
      $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.settings.details.success'), life: 5000 });
      emit('cancelEdit', false);
    }).catch((error) => {
      console.log(error);
      $toast.add({ severity: 'contrast', icon: 'pi-times-circle', summary: t('setup.error'), detail: t('modules.settings.details.error'), life: 5000 });
    });
  });
}

const cancel = (): void => {
  emit('cancelEdit', false);
}
</script>

<template>
  <div class="transition-all">
    <TransitionFade group>
      <div v-if="transition" class="h-[500px] w-full flex items-center justify-center">
        <div class="loading-container">
          <div class="loading-ring"></div>
        </div>
      </div>
      <div v-else-if="!transition" class="grid grid-cols-12 gap-4 grid-nogutter border-t border-surface pt-2 transition-all">
        <div class="col-span-12 lg:col-span-6 p-4">
          <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.company') }}</div>
          <Skeleton v-if="loading" width="50%" height="1.3rem" />
          <div v-else-if="!edit" class="text-surface-900 dark:text-surface-0">{{ `${shipperLoad?.name}/${shipperLoad?.commercial_name}` }}</div>
          <div v-else>
            <div class="grid grid-cols-12 gap-4 grid-nogutter">
              <div class="mb-4 col-span-12 lg:col-span-6">
                <label for="zip_code" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.name') }}</label>
                <InputText v-model="shipper.name" class="w-full" />
                <small v-for="error in v$.name.$errors" v-if="v$.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
              <div class="mb-4 col-span-12 lg:col-span-6">
                <label for="zip_code" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.commercial_name') }}</label>
                <InputText v-model="shipper.commercial_name" class="w-full" />
                <small v-for="error in v$.commercial_name.$errors" v-if="v$.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
            </div>
          </div>
        </div>
        <div class="col-span-12 lg:col-span-3 p-4">
          <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.tax_id') }}</div>
          <Skeleton v-if="loading" width="50%" height="1.3rem" />
          <div v-else class="text-surface-900 dark:text-surface-0">{{ shipperLoad?.tax_id }}</div>
        </div>
        <div class="col-span-12 lg:col-span-3 p-4">
          <!-- <img :src="shipperLoad?.logo_image_url" alt="Logo" class="w-24 h-24 rounded shadow-lg" /> -->
          <!-- <Button v-if="edit" icon="pi pi-upload" rounded class="absolute -top-5 -right-7 -mb-4" /> -->
          <div :style="{ backgroundImage: `url(${shipperLoad?.logo_image_url ? logo.name === 'File' ? shipperLoad.logo_image_url : createObjectURL(logo) : ''})` }" class="w-28 h-28 bg-cover bg-center rounded shadow-lg flex flex-col-reverse mouseover" @mouseenter="uploadMouseover = true" @mouseleave="uploadMouseover = false">
            <TransitionFade mode="in-out">
              <div v-if="edit && uploadMouseover" class="flex justify-center w-full h-8 bg-black bg-opacity-50 rounded-b cursor-pointer transition-all" @click="openFileUpload">
                <i class="pi pi-upload text-white mt-2"></i>
              </div>
            </TransitionFade>
            <input type="file" class="hidden" @change="changeLogo" />
          </div>
        </div>
        <div class="col-span-12 p-4">
          <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.address_complete') }}</div>
          <Skeleton v-if="loading" width="50%" height="1.3rem" />
          <div v-else-if="!edit" class="text-surface-900 dark:text-surface-0">{{ `${shipperLoad?.address}, ${shipperLoad?.number} - Complemento: ${shipperLoad?.address_2 ? shipperLoad?.address_2 : '-'}, ${shipperLoad?.address_3} - ${shipperLoad?.state}, ${shipperLoad?.country} - ${shipperLoad?.zip_code}` }}</div>
          <div v-else>
            <div class="grid grid-cols-12 gap-4 grid-nogutter">
              <div class="mb-4 col-span-12 lg:col-span-2">
              <label for="zip_code" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.zip_code') }}</label>
              <InputGroup>
                <InputMask v-model="shipper.zip_code" id="zip_code" mask="99999-999" type="text" :placeholder="$t('fields.zip_code_placeholder')" @keydown.enter="zipValidation" 
                :loading="zipLoading"
                :invalid="v$.zip_code.$error"
                @change="v$.zip_code.$touch" />
                <Button icon="pi pi-search" @click="zipValidation" />
              </InputGroup>
              <small v-for="error in v$.zip_code.$errors" v-if="v$.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            <div class="mb-4 col-span-12 lg:col-span-11"></div>
            <div class="mb-4 col-span-12 lg:col-span-4">
              <label for="address" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.address') }}</label>
              <InputText v-model="shipper.address" id="address" type="text" :placeholder="$t('fields.address_placeholder')" class="w-full"
                :invalid="v$.address.$error"
                :disabled="disabled.address"
                @change="v$.address.$touch" />
              <small v-for="error in v$.address.$errors" v-if="v$.address.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            <div class="mb-4 col-span-12 lg:col-span-1">
              <label for="number" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.number') }}</label>
              <InputText v-model="shipper.number" id="number" type="text" :placeholder="$t('fields.number_placeholder')" class="w-full"
                :invalid="v$.number.$error"
                @change="v$.number.$touch" />
              <small v-for="error in v$.number.$errors" v-if="v$.number.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            <div class="mb-4 col-span-12 lg:col-span-4">
              <label for="address_2" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.address_2') }}</label>
              <InputText v-model="shipper.address_2" id="address_2" type="text" :placeholder="$t('fields.address_2_placeholder')" class="w-full" />
            </div>
            <div class="mb-4 col-span-12 lg:col-span-3">
              <label for="address_3" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.address_3') }}</label>
              <InputText v-model="shipper.address_3" id="address_3" type="text" :placeholder="$t('fields.address_3_placeholder')" class="w-full"
                :invalid="v$.address_3.$error"
                :disabled="disabled.address"
                @change="v$.address_3.$touch" />
              <small v-for="error in v$.address_3.$errors" v-if="v$.address_3.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            <div class="mb-4 col-span-12 lg:col-span-3">
              <label for="city" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.city') }}</label>
              <InputText v-model="shipper.city" id="city" type="text" :placeholder="$t('fields.city_placeholder')" class="w-full"
                :invalid="v$.city.$error"
                :disabled="disabled.address"
                @change="v$.city.$touch" />
              <small v-for="error in v$.city.$errors" v-if="v$.city.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            <div class="mb-4 col-span-12 lg:col-span-1">
              <label for="state" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.state') }}</label>
              <InputText v-model="shipper.state" id="state" type="text" :placeholder="$t('fields.state_placeholder')" class="w-full"
                :invalid="v$.state.$error"
                :disabled="disabled.address"
                @change="v$.state.$touch" />
              <small v-for="error in v$.state.$errors" v-if="v$.state.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            <div class="mb-4 col-span-12 lg:col-span-1">
              <label for="country" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.country') }}</label>
              <InputText v-model="shipper.country" id="country" type="text" :placeholder="$t('fields.country_placeholder')" 
                :invalid="v$.country.$error"
                :disabled="disabled.address"
                @change="v$.country.$touch" />
              <small v-for="error in v$.country.$errors" v-if="v$.country.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
            </div>
            </div>
          </div>
        </div>
        <div class="col-span-12 p-4">
          <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.contact.name') }}</div>
          <Skeleton v-if="loading" width="50%" height="1.3rem" />
          <div v-else-if="!edit" class="text-surface-900 dark:text-surface-0 cursor-pointer" @click="showContactInfo = true">{{ shipperLoad?.contact_name }}</div>
          <div v-else>
            <div class="grid grid-cols-12 gap-4 grid-nogutter">
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.name" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.name') }}</label>
                <InputText v-model="shipper.contact_name" id="contact.name" type="text" :placeholder="$t('fields.contact.name_placeholder')" class="w-full"
                  :invalid="v$.contact_name.$error"
                  @change="v$.contact_name.$touch" />
                <small v-for="error in v$.contact_name.$errors" v-if="v$.contact_name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.email" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.email') }}</label>
                <InputText v-model="shipper.contact_email" id="contact.email" type="email" :placeholder="$t('fields.contact.email_placeholder')" class="w-full"
                  :invalid="v$.contact_email.$error"
                  @change="v$.contact_email.$touch" />
                <small v-for="error in v$.contact_email.$errors" v-if="v$.contact_email.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.title" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.title') }}</label>
                <InputText v-model="shipper.contact_title" id="contact.title" type="text" :placeholder="$t('fields.contact.title_placeholder')" class="w-full"
                  :invalid="v$.contact_title.$error"
                  @change="v$.contact_title.$touch" />
                <small v-for="error in v$.contact_title.$errors" v-if="v$.contact_title.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.department" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.department') }}</label>
                <InputText v-model="shipper.contact_department" id="contact.department" type="text" :placeholder="$t('fields.contact.department_placeholder')" class="w-full"
                  :invalid="v$.contact_department.$error"
                  @change="v$.contact_department.$touch" />
                <small v-for="error in v$.contact_department.$errors" v-if="v$.contact_department.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.mobile" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.mobile') }}</label>
                <InputMask v-model="shipper.contact_mobile" mask="(99) 99999-9999" id="contact.mobile" type="text" :placeholder="$t('fields.contact.mobile_placeholder')" class="w-full" 
                  :invalid="v$.contact_mobile.$error"
                  @change="v$.contact_mobile.$touch" />
                <small v-for="error in v$.contact_mobile.$errors" v-if="v$.contact_mobile.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
              </div>
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.phone" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.phone') }}</label>
                <InputMask v-model="shipper.contact_phone" mask="(99) 9999-9999" id="contact.phone" type="text" :placeholder="$t('fields.contact.phone_placeholder')" class="w-full" />
              </div>
              <div class="mb-4 col-span-12 md:col-span-6">
                <label for="contact.fax" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('fields.contact.fax') }}</label>
                <InputMask v-model="shipper.contact_fax" mask="(99) 9999-9999" id="contact.fax" type="text" :placeholder="$t('fields.contact.fax_placeholder')" class="w-full" />
              </div>
            </div>
          </div>
        </div>
        <div v-if="!edit" class="col-span-12 p-4">
          <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">{{ $t('fields.matrix.title') }}</div>
          <Skeleton v-if="loading" width="50%" height="1.3rem" />
          <div v-else-if="!edit" class="text-surface-900 dark:text-surface-0 leading-normal">{{ shipperLoad?.shipper_matrix_id ? $t('fields.matrix.branch ') : $t('fields.matrix.matrix') }}</div>
        </div>
      </div>
      <div v-if="edit" class="flex flex-row justify-between">
        <Button :label="$t('setup.buttons.save')" icon="pi pi-save" class="!w-32" @click="save" />
        <Button :label="$t('setup.buttons.cancel')" icon="pi pi-times" class="!w-32" @click="cancel" />
      </div>
    </TransitionFade>
  </div>

  <Dialog v-model:visible="showContactInfo" modal :header="$t('fields.contact.header')" class="min-w-[30rem]">
    <ul class="list-none p-0 m-0 border-t border-surface">
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
            <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.name') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12">{{ shipperLoad?.contact_name }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.contact_title') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12 leading-normal">{{ shipperLoad?.contact_title }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
            <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.department') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12">{{ shipperLoad?.contact_department }}</div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap">
            <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.email') }}</div>
            <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12">
                <a :href="`mailto:${shipperLoad?.contact_email}`" target="_blank"><Tag class="mr-2" :value="shipperLoad?.contact_email" :rounded="true" /></a>
            </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.phone') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12">
            <Tag :value="`${formatPhone(shipperLoad?.contact_phone)}`" severity="info" :rounded="true" />
          </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.mobile') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12">
            <Tag :value="`${formatPhone(shipperLoad?.contact_mobile)}`" severity="success" :rounded="true" />
          </div>
        </li>
        <li class="flex items-center py-4 px-2 flex-wrap bg-surface-50 dark:bg-surface-800">
          <div class="text-surface-500 dark:text-surface-300 w-full lg:w-4/12 font-medium">{{ $t('carriers.index.contact_info.fax') }}</div>
          <div class="text-surface-900 dark:text-surface-0 w-full lg:w-8/12">
            <Tag :value="`${formatPhone(shipperLoad?.contact_fax)}`" severity="warning" :rounded="true" />
          </div>
        </li>
    </ul>
  </Dialog>
</template>