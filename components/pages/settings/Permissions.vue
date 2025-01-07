<script setup lang="ts">
const { $toast } = useNuxtApp();
const authStore = useAuthStore();
const memberStore = useMemberStore();
const t = useNuxtApp().$i18n.t;
const confirm = useConfirm();
const route = useRoute();

const members = computed(() => memberStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
const loading = computed(() => memberStore.isLoading);

const columns = [
  { field: 'auth.create', header: t('modules.settings.permissions.auth.create') },
  { field: 'auth.read', header: t('modules.settings.permissions.auth.read') },
  { field: 'auth.update', header: t('modules.settings.permissions.auth.update') },
  { field: 'auth.delete', header: t('modules.settings.permissions.auth.delete') },
];

console.log(query.value);
onMounted(async () => {
  await memberStore.fetchData(query.value); 
});
</script>

<template>
  <DataTable :value="members?.data" :loading="loading">
    <Column>
      <template #body="{ data }">
        <span>{{ data.name }}</span>
      </template>
    </Column>
    <Column v-for="column in columns" :key="column.field" :field="column.field" :header="column.header">
      <template #body="{ data }">
        <Checkbox />
      </template>
    </Column>
  </DataTable>
</template>