<script setup lang="ts">
// import Paginatorc from '@/components/pages/Paginatorc.vue';
const memberStore = useMemberStore();
const route = useRoute();

const members = computed(() => memberStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
const loading = computed(() => memberStore.isLoading);

const items = [
  {
    label: 'Edit',
    icon: 'pi pi-pencil',
    command: () => {
      console.log('Edit');
    },
  },
  {
    label: 'Inactive',
    icon: 'pi pi-user-minus',
    command: () => {
      console.log('Delete');
    },
  },
];

onMounted(async () => {
  console.log('query', query.value);
  await memberStore.fetchData(query.value); 
});

watch(
  () => route.query, // Watch route.query for changes
  async (newQuery, oldQuery) => {
    if (newQuery !== oldQuery) {
      await memberStore.fetchData(new URLSearchParams(newQuery).toString()); 
    }
  }
);
</script>

<template>
  <section class="flex flex-wrap gap-4 py-12 justify-between border-t border-surface">
    <div class="flex-shrink-0 w-60">
      <h3 class="mb-6 mt-0 text-surface-900 dark:text-surface-0 font-medium text-xl">Members</h3>
      <p class="mb-6 mt-0 text-surface-700 dark:text-surface-100 font-normal text-base">Manage your member in this project</p>
      <Button label="Invite a member" class="w-auto" />
    </div>
    <div class="overflow-x-scroll">
      <DataTable :value="members?.data" row-hover :loading="loading" class="header-border">
        <Column class="min-w-[25rem]">
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.name') }}</span>
          </template>
          <template #body="{ data }">
            <div class="flex items-center gap-4">
              <Avatar :image="data.user_info.photo_url" class="mr-2" size="large" shape="circle" />
              <div>
                <p class="mt-0 mb-2 font-medium text-lg text-color-primary">
                  {{ data.name }}
                </p>
                <p class="mt-0 mb-2 font-normal text-base text-muted-color text-sm">
                  {{ data.email }}
                </p>
              </div>
            </div>
          </template>
        </Column>
        <Column class="min-w-56">
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.joined_at') }}</span>
          </template>
          <template #body="{ data }">
            <p class="mt-0 mb-2 font-normal text-base text-muted-color">
              {{ formatDate(data.created_at) }}
            </p>
          </template>
        </Column>
        <Column class="min-w-[13rem]">
          <template #header>
            <span class="font-semibold text-sm text-muted-color">{{ $t('fields.last_active_at') }}</span>
          </template>
          <template #body="{ data }">
            <p class="mt-0 mb-2 font-normal text-base text-muted-color">
              {{ formatDate(data.updated_at, true) }}
            </p>
          </template>
        </Column>
        <Column class="min-w-32">
          <template #body>
            <Button type="button" icon="pi pi-ellipsis-v" text severity="secondary" @click="$refs.menu.toggle($event)" />
            <Menu ref="menu" append-to="body" popup :model="items"> 
              <template #item="{ item, props }">
                <a v-ripple class="flex items-center" v-bind="props.action">
                  <span :class="item.icon" />
                  <span>{{ item.label }}</span>
                  <Badge v-if="item.badge" class="ml-auto" :value="item.badge" />
                  <span v-if="item.shortcut" class="ml-auto border border-surface rounded bg-emphasis text-muted-color text-xs p-1">{{ item.shortcut }}</span>
                </a>
              </template>
            </Menu>
          </template>
        </Column>
      </DataTable>
      <!-- <PagesPaginatorc v-if="members.total > 0" v-model:totalRecords="members.total" v-model:rows="members.per_page" v-model:first="members.from" v-model:last="members.to" /> -->
    </div>
  </section>
</template>