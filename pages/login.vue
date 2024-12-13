<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const t = useNuxtApp().$i18n.t;

definePageMeta({
  layout: 'none',
});

const button = ref({
  iconClass: 'pi-moon',
});

const user = ref({
  email: '',
  password: '',
  remember: false,
});

const error = ref({
  email: false,
  password: false,
  showMessage: false,
  message: '',
});

const userAuthenticated = computed(() => authStore.isAuthenticated);

if (userAuthenticated.value) {
  router.push('/dashboard');
}

const onLogin = async (): Promise<void> => {
  if (!user.value.email) {
    error.value.showMessage = true;
    error.value.email = true;
  }

  if (!user.value.password) {
    error.value.showMessage = true;
    error.value.password = true;
  }

  if (error.value.email || error.value.password) {
    error.value.showMessage = true;
    error.value.message = t('modules.login.errors.empty_field');
    return;
  }

  authStore.login(user.value).then((response) => {
    if (response) {
      error.value.email = false;
      error.value.password = false;
      if (route.query.redirect) {
        router.back();
      }

      router.push('/dashboard');
    } else {
      error.value.email = false;
      error.value.password = false;
      error.value.showMessage = true;
      error.value.message = t('modules.login.errors.invalid_user_pass');
    }
  }).catch(() => {
    error.value.email = false;
    error.value.password = false;
    error.value.showMessage = true;
    error.value.message = t('modules.login.errors.500');
  });
};

const onThemeToggler = (): void => {
  const root = document.getElementsByTagName('html')[0];

  root.classList.toggle('p-dark');
  button.value.iconClass = button.value.iconClass === 'pi-moon' ? 'pi-sun' : 'pi-moon';
  localStorage.setItem('theme', root.classList.contains('p-dark') ? 'dark' : 'light');
};
</script>

<style lang="scss">
.pw-input-full input {
  width: 100%;
}
</style>

<template>
  <div class="py-20 flex flex-col items-center justify-center bg-surface-50 dark:bg-surface-950 h-screen">
    <div
      class="max-w-xl w-full flex flex-col items-center gap-8 bg-surface-0 dark:bg-surface-900 pt-12 pb-6 px-6 rounded-3xl shadow-[0px_24px_48px_0px_rgba(0,0,0,0.04)]">
      <div class="flex justify-end max-w-xl w-full absolute -mt-5 mr-12">
        <Button :icon="`pi ${button.iconClass}`" @click="onThemeToggler" />
      </div>
      <div>
        <svg class="mb-4 fill-surface-600 dark:fill-surface-200 h-14" viewBox="0 0 30 32" fill="none"
          xmlns="http://www.w3.org/2000/svg">
          <path fill-rule="evenodd" clip-rule="evenodd"
            d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z" />
        </svg>
      </div>
      <h1 class="text-center text-3xl font-medium text-surface-900 dark:text-surface-0">{{ $t('hermes_tms') }}</h1>
      <div class="flex items-center gap-4 w-full">
        <Button outlined icon="pi pi-google text-lg" severity="secondary" v-tooltip.top="$t('setup.buttons.google')"
          class="!flex-1 !py-1 !text-surface-900 dark:!text-surface-0" />
        <Button outlined icon="pi pi-facebook text-lg" severity="secondary"
          class="!flex-1 !py-1 !text-surface-900 dark:!text-surface-0" />
        <Button outlined icon="pi pi-apple text-lg" severity="secondary"
          class="!flex-1 !py-1 !text-surface-900 dark:!text-surface-0" />
      </div>
      <div class="flex items-center gap-6 w-full">
        <div class="h-[1px] flex-1 bg-surface-200 dark:bg-surface-800" />
        <div class="text-surface-700 dark:text-surface-300 font-medium uppercase">{{ $t('common.or') }}</div>
        <div class="h-[1px] flex-1 bg-surface-200 dark:bg-surface-800" />
      </div>
      <Transition name="fade">
        <Message class="w-full" severity="error" closable v-if="error.showMessage">
          {{ error.message }}
        </Message>
      </Transition>
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2">
          <label for="email">{{ $t('fields.contact.email') }}</label>
          <InputText id="email" v-model="user.email" :placeholder="$t('fields.contact.email_placeholder')" class="dark:!bg-surface-900" :invalid="error.email" @keyup.enter="onLogin" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">{{ $t('fields.password') }}</label>
          <Password :feedback="false" toggleMask id="password" v-model="user.password" :placeholder="$t('fields.password_placeholder')" class="dark:!bg-surface-900 pw-input-full" :invalid="error.password" pt:pcInput:class="w-full" pt:pcInput:id="password" @keyup.enter="onLogin" />
        </div>
      </div>
      <div class="flex items-center justify-between w-full">
        <div class="flex items-center">
          <Checkbox v-model="user.remember" input-id="remember_me" name="remember_me" />
          <label for="remember_me" class="ml-2 text-surface-700 dark:text-surface-300"> {{ $t('fields.remember_me') }} </label>
        </div>
        <a href="#" class="font-medium text-primary hover:text-primary-emphasis transition-all">{{ $t('fields.forgot_password') }}</a>
      </div>
      <Button :label="$t('setup.buttons.enter')" class="w-full" @click="onLogin" />
      <div class="mt-2 text-surface-700 dark:text-surface-300 font-medium">{{ $t('modules.login.no_account') }} <a href="#"
          class="text-primary hover:text-primary-emphasis transition-all">{{ $t('modules.login.no_account_signup') }}</a></div>
    </div>
  </div>
</template>