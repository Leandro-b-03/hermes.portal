<script setup lang="ts">
const router = useRouter();
const t = useNuxtApp().$i18n.t;

const props = defineProps<{
  filter: string;
  fields: string[];
}>();

const searchInput = ref(props.filter || '');
const selectedFields = ref(props.fields || []);

const changeWords = [
  "phone",
  "email",
  "fax",
  "mobile",
  "title", "department"
]

const fieldOptions = computed(() => 
  props.fields.map(field => ({
    label: labelVerify(field),
    value: field
  }))
);

const labelVerify = (field: string): string => {
  if (changeWords.includes(field)) {
    if (field.includes('carrierContact')) {
      return t(`fields.${field.replace('carrierContact', 'carrier')}`);
    } else {
      return t(`fields.contact.${field}`);
    }
  } else {
    return t(`fields.${field}`);
  }
};

const search = async (searchInput: string): Promise<void> => {
  scrollToTop();
  router.push({
    query: {
      ...router.currentRoute.value.query,
      filter: searchInput,
      fields: selectedFields.value.join(',')
    }
  });
};
</script>

<template>
  <InputGroup>
    <MultiSelect v-model="selectedFields" :options="fieldOptions" optionLabel="label" optionValue="value" filter display="chip" :maxSelectedLabels="3" :placeholder="$t('setup.tables.select')" class="w-1/4"></MultiSelect>
    <InputText v-model="searchInput" :placeholder="$t('common.search')" class="w-full" @keyup.enter="search(searchInput)" />
    <Button icon="pi pi-search" severity="secondary" @click="search(searchInput)" />
  </InputGroup>
</template>