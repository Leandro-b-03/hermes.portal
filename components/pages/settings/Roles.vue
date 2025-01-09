<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';

const { $toast } = useNuxtApp();
const authStore = useAuthStore();
const roleStore = useRoleStore();
const t = useNuxtApp().$i18n.t;
const confirm = useConfirm();
const route = useRoute();

const { required, email, sameAs, minLength } = useI18nValidators();
const data = computed(() => roleStore.data);
const query = computed(() => new URLSearchParams(route.query).toString());
const loading = computed(() => roleStore.isLoading);
const roles = computed(() => data.value?.roles);
const permissions = computed(() => data.value?.permissions);
const role = ref({
  name: '',
  description: '',
  permissions: [],
});
const schema = {
  name: {
    required: required,
    minLength: minLength(3),
  },
};

const v$ = useVuelidate(schema, role);

onMounted(async () => {
  await roleStore.fetchData(query.value); 
});

const save = async (): Promise<void> => {
  v$.value.$validate().then(() => {
    if (v$.value.$error) {
      return;
    }
    // roleStore.save(role.value).then(() => {
    //   $toast.success(t('messages.success'));
    // });
  });
};
</script>

<template>
  <div class="flex flex-row justify-between">
    <Menu :model="roles" class="!border-none">
      <template #start>
        {{ $t('modules.settings.roles-permissions.roles') }}
      </template>
      <template #item="{ item, props }">
        <a v-ripple class="flex items-center" v-bind="changeRole(item.name)">
          <span>{{ item.label }}</span>
        </a>
      </template>
    </Menu>
    <div class="grow py-2 px-4 ml-2">
      <div class="grid grid-cols-12 gap-4">
        <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4">
          <label for="name" class="font-medium text-surface-900 dark:text-surface-0 mb-1 block">{{ $t('fields.name') }}</label>
          <InputText v-model="role.name" id="name" type="text" class="w-full" :placeholder="$t('fields.name_roles_placeholder')" />
          <FieldError :errors="v$.name.$errors" :error="v$.name.$error" />
        </div>
        <div class="col-span-12"></div>
        <div class="mb-4 col-span-12 md:col-span-6 lg:col-span-4">
          <label for="description" class="font-medium text-surface-900 dark:text-surface-0 mb-1 block">{{ $t('fields.description') }}</label>
          <Textarea v-model="role.description" id="description" type="text" class="w-full" rows="5" cols="30" :placeholder="$t('fields.description_roles_placeholder')" />
        </div>
      </div>
      <div class="flex flex-wrap justify-start lg:justify-between gap-4 mb-4">
        <div v-for="module in permissions" class="border border-surface-200 dark:border-surface-700 rounded p-4 w-72">
          <h2 class="h2 mb-2">{{ $t(`modules.settings.roles-permissions.${module.title}.title`) }}</h2>
          <div v-for="permission in module.permissions">
            <Checkbox :key="permission.name" :value="permission.name" :name="permission.name" />
            <label :for="permission.name" class="ml-2">{{ $t(`modules.settings.roles-permissions.${permission.name}`) }}</label>
          </div>
        </div>
      </div>
      <div class="flex justify-between">
        <Button :label="$t('setup.buttons.cancel')" @click="cancel" />
        <Button :label="$t('setup.buttons.save')" @click="save" />
      </div>
    </div>
  </div>
</template>