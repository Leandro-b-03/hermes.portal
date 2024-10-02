<script setup lang="ts">
const authStore = useAuthStore();
const loading = ref(true);

const user = computed(() => authStore.authUser);

const button = ref({
  iconClass: 'pi-moon',
});

onMounted(async () => {
  await authStore.fetchMe();
});

watch(user, () => {
  loading.value = false;
});

const onThemeToggler = (): void => {
  const root = document.getElementsByTagName('html')[0];

  root.classList.toggle('p-dark');
  button.value.iconClass = button.value.iconClass === 'pi-moon' ? 'pi-sun' : 'pi-moon';
};
</script>

<template>
  <header class="header min-w-full pl-[280px] relative lg:fixed top-0 left-0 z-10">
    <div class="h-[60px] flex justify-between items-center px-8 bg-surface-0 dark:bg-surface-950 shadow border-b border-surface">
      <div class="flex">
        <a v-ripple v-styleclass="{
          selector: '#app-sidebar',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-fadeinleft',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-fadeoutleft',
          hideOnOutsideClick: true
        }" class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100 mr-4 mt-1">
          <i class="pi pi-bars text-4xl" />
        </a>

        <IconField icon-position="left">
          <InputIcon class="pi pi-search" />
          <InputText :placeholder="$t('search')" class="!border-0 !shadow-none !w-40 sm:!w-80" />
        </IconField>
      </div>
      <a v-ripple v-styleclass="{
        selector: '@next',
        enterFromClass: 'hidden',
        enterActiveClass: 'animate-fadein',
        leaveToClass: 'hidden',
        leaveActiveClass: 'animate-fadeout',
        hideOnOutsideClick: true
      }" class="cursor-pointer block lg:hidden text-surface-700 dark:text-surface-100">
        <i class="pi pi-ellipsis-v text-2xl" />
      </a>
      <ul
        class="list-none p-0 m-0 hidden lg:flex lg:items-center select-none lg:flex-row bg-surface-0 dark:bg-surface-950 border lg:border-0 border-surface right-0 top-full z-10 shadow lg:shadow-none absolute lg:static">
        <li>
          <a
            class="flex p-4 lg:px-4 lg:py-2 items-center text-surface-600 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors" @click="onThemeToggler">
            <i class="pi text-base lg:text-2xl mr-2 lg:mr-0" :class="button.iconClass" />
            <span class="block lg:hidden font-medium">{{ $t('dark-mode') }}</span>
          </a>
        </li>
        <li>
          <a
            class="flex p-4 lg:px-4 lg:py-2 items-center text-surface-600 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors">
            <i class="pi pi-inbox text-base lg:text-2xl mr-2 lg:mr-0" />
            <span class="block lg:hidden font-medium">{{ $t('inbox') }}</span>
          </a>
        </li>
        <li>
          <a
            class="flex p-4 lg:px-4 lg:py-2 items-center text-surface-600 dark:text-surface-200 hover:text-surface-900 dark:hover:text-surface-0 hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors">
            <OverlayBadge severity="danger" class="mr-2 lg:mr-0">
              <i class="pi pi-bell text-base lg:text-2xl" />
            </OverlayBadge>
            <span class="block lg:hidden font-medium">{{ $t('notifications') }}</span>
          </a>
        </li>
        <li class="border-t border-surface lg:border-t-0">
          <a v-tooltip.left="user?.name"
            class="flex p-4 lg:px-4 lg:py-2 items-center hover:bg-surface-100 dark:hover:bg-surface-700 font-medium rounded-border cursor-pointer duration-150 transition-colors">
            <Skeleton v-if="loading" class="mr-4 lg:mr-0 rounded" width="2rem" height="2rem" />
            <img v-else
              :src="user?.user_info?.photo_url" :alt="user?.name"
              class="mr-4 lg:mr-0 w-8 h-8 rounded" />
            <div class="block lg:hidden">
              <div class="text-surface-900 dark:text-surface-0 font-medium">{{ user?.name }}</div>
              <span class="text-surface-600 dark:text-surface-200 font-medium text-sm">{{ user?.role }}</span>
            </div>
          </a>
        </li>
      </ul>
    </div>
  </header>
</template>