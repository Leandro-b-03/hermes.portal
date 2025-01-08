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

const modules = [
  {
    label: t("modules.settings.roles-permissions.auth.title"),
    permissions: [
      { field: 'auth.create', header: t('modules.settings.roles-permissions.auth.create') },
      { field: 'auth.read', header: t('modules.settings.roles-permissions.auth.read') },
      { field: 'auth.update', header: t('modules.settings.roles-permissions.auth.update') },
      { field: 'auth.delete', header: t('modules.settings.roles-permissions.auth.delete') },
    ]
  },
  {
    label: t("modules.settings.roles-permissions.connect.title"),
    permissions: [
      { field: 'connect.create', header: t('modules.settings.roles-permissions.connect.create') },
      { field: 'connect.read', header: t('modules.settings.roles-permissions.connect.read') },
      { field: 'connect.update', header: t('modules.settings.roles-permissions.connect.update') },
      { field: 'connect.delete', header: t('modules.settings.roles-permissions.connect.delete') },
    ]
  },
];

const roles = [
  {
    label: 'roles',
    items: [
      { label: 'admin' },
      { label: 'user' },
      { label: 'add' },
    ],
  }
]

console.log(query.value);
onMounted(async () => {
  await memberStore.fetchData(query.value); 
});
</script>

<template>
  <div class="flex flex-row justify-between">
    <Menu :model="roles" class="!border-none" />
    <div class="grow py-2 px-4 ml-2">
      <div class="grid grid-cols-12 gap-4">
        <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4">
          <label for="name" class="font-medium text-surface-900 dark:text-surface-0 mb-1 block">Name</label>
          <InputText id="name" type="text" class="w-full" />
        </div>
        <div class="col-span-12"></div>
        <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0 mb-1 block">Description</label>
          <Textarea id="description" type="text" class="w-full" rows="5" cols="30" />
        </div>
      </div>
      <div class="flex justify-start gap-2 mb-4">
        <div v-for="module in modules" class="border border-surface-200 dark:border-surface-700 rounded p-4">
          <h2 class="h2 mb-2">{{ module.label }}</h2>
          <div v-for="permission in module.permissions">
            <Checkbox :key="permission.field" :value="permission.field" :name="permission.field" />
            <label :for="permission.field" class="ml-2">{{ permission.header }}</label>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <Button label="Cancel" @click="cancel" />
        <Button label="Save" @click="save" />
      </div>
    </div>
  </div>
</template>