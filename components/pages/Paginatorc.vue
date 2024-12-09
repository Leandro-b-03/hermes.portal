<script setup lang="ts">
const router = useRouter();

const props = defineProps<{
  totalRecords: number | null;
  rows: number | null;
  first: number | null;
  last: number | null;
}>();

const totalRecords = props.totalRecords ?? 0;
const rows = props.rows ?? 0;
const first = props.first ?? 0;
const last = props.last ?? 0;

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
  <Paginator class="border-b border-slate-200" :totalRecords="totalRecords" :rows="rows" :first="first" :last="last"
    :rowsPerPageOptions="[10, 25, 50, 100]" @page="onPageChange">
    <template #start="slotProps">
      {{ `${$t('setup.tables.total')}: ${totalRecords}` }}
    </template>
    <template #end>
    </template>
  </Paginator>
</template>