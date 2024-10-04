<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';

const { $toast } = useNuxtApp();
const router = useRouter();
const carrierStore = useCarrierStore();
const t = useNuxtApp().$i18n.t;

const props = defineProps({
  carrier: {
    type: Object,
    required: false
  }
});

const { required, email, sameAs, minLength } = useI18nValidators();
const loading = computed(() => carrierStore.isLoading);
const zipLoading = ref(false);
const carrier = reactive({
  id: '',
  tax_id: '',
  name: '',
  address: '',
  address_2: '',
  address_3: '',
  number: '',
  city: '',
  state: '',
  zip: '',
  country: '',
  contact: reactive({
    id: '',
    shipper_id: '',
    name: '',
    email: '',
    title: '',
    department: '',
    mobile: '',
    phone: '',
    fax: '',
  }),
  active: true,
});
const errors = reactive({
  tax_id: false,
  tax_id_message: '',
});

const schema = computed(() => {
  return {
    tax_id: { 
      required: required,
      minLength: minLength(14),
    },
    name: { 
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
      minLength: minLength(3),
    },
    state: { 
      required: required,
      minLength: minLength(2),
    },
    zip: { 
      required: required,
      minLength: minLength(8),
    },
    country: { 
      required: required,
      minLength: minLength(3),
    },
    contact: {
      name: {
        required: required,
        minLength: minLength(3),
      },
      email: { 
        required: required,
        email: email,
      },
      title: { 
        required: required,
        minLength: minLength(2),
      },
      department: { 
        required: required,
        minLength: minLength(2),
      },
      mobile: { 
        required: required,
        minLength: minLength(10),
      },
    },
  };
});

const disabled = ref({
  address: true,
  carrier: false,
  contact: false,
});
const showForm = ref(false);
const v$ = useVuelidate(schema, carrier);

watch((loading), async () => {
  if (props.carrier?.id) {
    showForm.value = true;
    disabled.value.carrier = true;

    
    carrier.id = props.carrier?.id || '';
    carrier.tax_id = props.carrier?.tax_id || '';
    carrier.name = props.carrier?.name || '';
    carrier.address = props.carrier?.address || '';
    carrier.address_2 = props.carrier?.address_2 || '';
    carrier.address_3 = props.carrier?.address_3 || '';
    carrier.number = props.carrier?.number || '';
    carrier.city = props.carrier?.city || '';
    carrier.state = props.carrier?.state || '';
    carrier.zip = props.carrier?.zip || '';
    carrier.country = props.carrier?.country || '';
    carrier.contact.id = props.carrier?.carrier_contact?.id || '';
    carrier.contact.shipper_id = props.carrier?.carrier_contact?.shipper_id || '';
    carrier.contact.name = props.carrier?.carrier_contact?.name || '';
    carrier.contact.email = props.carrier?.carrier_contact?.email || '';
    carrier.contact.title = props.carrier?.carrier_contact?.title || '';
    carrier.contact.department = props.carrier?.carrier_contact?.department || '';
    carrier.contact.mobile = props.carrier?.carrier_contact?.mobile || '';
    carrier.contact.phone = props.carrier?.carrier_contact?.phone || '';
    carrier.contact.fax = props.carrier?.carrier_contact?.fax || '';
    carrier.active = props.carrier?.carrier_shipper.active || true;
  }
}, { deep: true, immediate: true });

const find = async (): Promise<any> => {
  v$.value.tax_id.$touch();

  if (v$.value.tax_id.$error) {
    return;
  }
  
  carrierStore.find(carrier.tax_id).then((response) => {
    disabled.value.carrier = true;
    showForm.value = true;
    carrier.id = response?.id;
    carrier.name = response?.name;
    carrier.zip = response?.zip;
    carrier.address = response?.address;
    carrier.address_2 = response?.address_2;
    carrier.address_3 = response?.address_3;
    carrier.number = response?.number;
    carrier.city = response?.city;
    carrier.state = response?.state;
    carrier.country = response?.country;
    carrier.contact.id = response?.carrier_contact.id;
    carrier.contact.shipper_id = response?.carrier_contact.shipper_id;
    carrier.contact.name = response?.carrier_contact.name;
    carrier.contact.email = response?.carrier_contact.email;
    carrier.contact.title = response?.carrier_contact.title;
    carrier.contact.department = response?.carrier_contact.department;
    carrier.contact.mobile = response?.carrier_contact.mobile;
    carrier.contact.phone = response?.carrier_contact.phone;
    carrier.contact.fax = response?.carrier_contact.fax;
    carrier.active = response?.carrier_shipper.active;
  }).catch((error) => {
    if (error?.data?.tax_id) {
      errors.tax_id = true
    } else {
      showForm.value = true;
    }
  });
}

const zipValidation = async (): Promise<any> => {
  if (carrier.zip.length === 9) {
    zipLoading.value = true;
    const zip = carrier.zip.replace('-', '');
    const { data, status, error, refresh, clear } = await useAsyncData('cep', () => 
      $fetch(`https://opencep.com/v1/${zip}`)
    );

    disabled.value.address = true;

    if (status.value === 'success') {
      carrier.address = data.value.logradouro;
      carrier.address_3 = data.value.bairro;
      carrier.city = data.value.localidade;
      carrier.state = data.value.uf;
      carrier.country = 'Brasil';
    } else {
      disabled.value.address = false;
    }

    zipLoading.value = false;
  }
}

const submit = async (): Promise<any> => {
  v$.value.$validate().then(() => {
    if (v$.value.$error) {
      return;
    }

    carrierStore.createOrUpdate(carrier).then(() => {
      console.log($toast);
      $toast.add({ severity: 'info', summary: 'Info', detail: 'Message Content', life: 3000 });
      // $toast.add({ severity: 'info', summary: t('setup.info'), detail: t(!carrier.id ? 'carriers.create.success' : 'carriers.edit.success'), life: 5000 });
      router.push({ path: '/carriers' });
    }).catch((error) => {
      console.log(error);
    });
  });
}
</script>

<template>
<Fluid>
  <div class="grid grid-cols-12 gap-4">
    <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4 xl:col-span-2">
      <label for="tax_id" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.tax_id') }}</label>
      <InputGroup>
        <InputMask v-model="carrier.tax_id" id="tax_id" type="text" mask="99.999.999/9999-99" :placeholder="$t('carriers.fields.tax_id_placeholder')" :disabled="disabled.carrier" @keydown.enter="find" :invalid="v$.tax_id.$error || errors.tax_id" @change="v$.tax_id.$touch" />
        <Button icon="pi pi-search" :loading="loading" @click="find" />
      </InputGroup>
      <small v-if="errors.tax_id" class="text-red-500">{{ $t('carriers.fields.tax_id_invalid') }}</small>
      <small v-for="error in v$.tax_id.$errors" v-if="v$.tax_id.$error || errors.tax_id" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
    </div>
    <Transition name="fade">
      <div v-if="showForm" class="md:col-span-12 grid grid-cols-12 gap-4">
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="name" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.name') }}</label>
          <InputText v-model="carrier.name" id="name" type="text" :placeholder="$t('carriers.fields.name_placeholder')" 
            :disabled="disabled.carrier" 
            :invalid="v$.name.$error"
            @change="v$.name.$touch" />
            <small v-for="error in v$.name.$errors" v-if="v$.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-2">
          <label for="name" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.status') }}</label>
          <ToggleButton v-model="carrier.active" :onLabel="$t('carriers.fields.active')" :offLabel="$t('carriers.fields.inactive')" />
        </div>
        <div class="mb-4 col-span-12 md:col-span-4"></div>
        <div class="mb-4 col-span-12 md:col-span-2">
          <label for="zip" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.zip') }}</label>
          <InputGroup>
            <InputMask v-model="carrier.zip" id="zip" mask="99999-999" type="text" :placeholder="$t('carriers.fields.zip_placeholder')" @keydown.enter="zipValidation" :disabled="disabled.carrier"
            :loading="zipLoading"
            :invalid="v$.zip.$error"
            @change="v$.zip.$touch" />
            <Button icon="pi pi-search" @click="zipValidation" />
          </InputGroup>
          <small v-for="error in v$.zip.$errors" v-if="v$.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-11"></div>
        <div class="mb-4 col-span-12 md:col-span-4">
          <label for="address" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.address') }}</label>
          <InputText v-model="carrier.address" id="address" type="text" :placeholder="$t('carriers.fields.address_placeholder')" :disabled="disabled.address"
            :invalid="v$.address.$error"
            @change="v$.address.$touch" />
          <small v-for="error in v$.address.$errors" v-if="v$.address.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-1">
          <label for="number" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.number') }}</label>
          <InputText v-model="carrier.number" id="number" type="text" :placeholder="$t('carriers.fields.number_placeholder')" :disabled="disabled.address && disabled.carrier"
            :invalid="v$.number.$error"
            @change="v$.number.$touch" />
          <small v-for="error in v$.number.$errors" v-if="v$.number.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-4">
          <label for="address_2" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.address_2') }}</label>
          <InputText v-model="carrier.address_2" id="address_2" type="text" :placeholder="$t('carriers.fields.address_2_placeholder')" :disabled="disabled.address && disabled.carrier" />
        </div>
        <div class="mb-4 col-span-12 md:col-span-3">
          <label for="address_3" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.address_3') }}</label>
          <InputText v-model="carrier.address_3" id="address_3" type="text" :placeholder="$t('carriers.fields.address_3_placeholder')" :disabled="disabled.address" 
            :invalid="v$.address_3.$error"
            @change="v$.address_3.$touch" />
          <small v-for="error in v$.address_3.$errors" v-if="v$.address_3.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-3">
          <label for="city" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.city') }}</label>
          <InputText v-model="carrier.city" id="city" type="text" :placeholder="$t('carriers.fields.city_placeholder')" :disabled="disabled.address" 
            :invalid="v$.city.$error"
            @change="v$.city.$touch" />
          <small v-for="error in v$.city.$errors" v-if="v$.city.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-1">
          <label for="state" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.state') }}</label>
          <InputText v-model="carrier.state" id="state" type="text" :placeholder="$t('carriers.fields.state_placeholder')" :disabled="disabled.address" 
            :invalid="v$.state.$error"
            @change="v$.state.$touch" />
          <small v-for="error in v$.state.$errors" v-if="v$.state.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-1">
          <label for="country" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.country') }}</label>
          <InputText v-model="carrier.country" id="country" type="text" :placeholder="$t('carriers.fields.country_placeholder')" :disabled="disabled.address" 
            :invalid="v$.country.$error"
            @change="v$.country.$touch" />
          <small v-for="error in v$.country.$errors" v-if="v$.country.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-7"></div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.name" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.name') }}</label>
          <InputText v-model="carrier.contact.name" id="contact.name" type="text" :placeholder="$t('carriers.fields.contact.name_placeholder')" :disabled="disabled.contact" 
            :invalid="v$.contact.name.$error"
            @change="v$.contact.name.$touch" />
          <small v-for="error in v$.contact.name.$errors" v-if="v$.contact.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.email" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.email') }}</label>
          <InputText v-model="carrier.contact.email" id="contact.email" type="email" :placeholder="$t('carriers.fields.contact.email_placeholder')" :disabled="disabled.contact" 
            :invalid="v$.contact.email.$error"
            @change="v$.contact.email.$touch" />
          <small v-for="error in v$.contact.email.$errors" v-if="v$.contact.email.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.title" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.title') }}</label>
          <InputText v-model="carrier.contact.title" id="contact.title" type="text" :placeholder="$t('carriers.fields.contact.title_placeholder')" :disabled="disabled.contact" 
            :invalid="v$.contact.title.$error"
            @change="v$.contact.title.$touch" />
          <small v-for="error in v$.contact.title.$errors" v-if="v$.contact.title.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.department" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.department') }}</label>
          <InputText v-model="carrier.contact.department" id="contact.department" type="text" :placeholder="$t('carriers.fields.contact.department_placeholder')" :disabled="disabled.contact" 
            :invalid="v$.contact.department.$error"
            @change="v$.contact.department.$touch" />
          <small v-for="error in v$.contact.department.$errors" v-if="v$.contact.department.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.mobile" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.mobile') }}</label>
          <InputMask v-model="carrier.contact.mobile" mask="(99) 99999-9999" id="contact.mobile" type="text" :placeholder="$t('carriers.fields.contact.mobile_placeholder')" :disabled="disabled.contact" 
            :invalid="v$.contact.mobile.$error"
            @change="v$.contact.mobile.$touch" />
          <small v-for="error in v$.contact.mobile.$errors" v-if="v$.contact.mobile.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
        </div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.phone" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.phone') }}</label>
          <InputMask v-model="carrier.contact.phone" mask="(99) 9999-9999" id="contact.phone" type="text" :placeholder="$t('carriers.fields.contact.phone_placeholder')" :disabled="disabled.contact" />
        </div>
        <div class="mb-4 col-span-12 md:col-span-6">
          <label for="contact.fax" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.contact.fax') }}</label>
          <InputMask v-model="carrier.contact.fax" mask="(99) 9999-9999" id="contact.fax" type="text" :placeholder="$t('carriers.fields.contact.fax_placeholder')" :disabled="disabled.contact" />
        </div>
      </div>
    </Transition>
    <div class="border-surface border-t opacity-50 mb-4 col-span-12" />
  </div>
  <div class="flex flex-row justify-between">
    <Button :label="$t(!carrier.id ? 'carriers.create.buttons.save' : 'carriers.edit.buttons.save')" icon="pi pi-truck" class="!w-32" @click="submit" />
    <NuxtLink to="/carriers" class="!w-32">
      <Button :label="$t('carriers.create.buttons.cancel')" icon="pi pi-times" class="!w-32" />
    </NuxtLink>
  </div>
</Fluid>
</template>