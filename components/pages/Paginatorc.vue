<script setup lang="ts">
const router = useRouter();

const props = defineProps<{
  totalRecords: number;
  rows: number;
  first: number;
  last: number;
}>();

const onPageChange = (event: { first: number }): void =>{
  scrollToTop();
  const newPage = event.page + 1; // PrimeVue pages are 0-indexed, so add 1
  const newPerPage = event.rows;
  router.push({
    query: {
      ...router.currentRoute.value.query,
      page: newPage,
      per_page: newPerPage
    }
  });
};
</script>

<template>
  <Paginator class="border-b border-slate-200" :totalRecords="props.totalRecords" :rows="props.rows" :first="props.first" :last="props.last"
    :rowsPerPageOptions="[10, 25, 50, 100]" @page="onPageChange">
    <template #start="slotProps">
      {{ `${$t('setup.tables.total')}: ${props.totalRecords}` }}
    </template>
    <template #end>
    </template>
  </Paginator>
</template>