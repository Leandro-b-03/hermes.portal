<script setup lang="ts">
import { useVuelidate } from '@vuelidate/core';

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const t = useNuxtApp().$i18n.t;

definePageMeta({
  layout: 'none',
});

const { required, email, minLength, sameAs } = useI18nValidators();
const token = route.query.token as string;
const emailSignup = computed(() => authStore.signupEmail);
const error500 = ref(false);
const button = ref({
  iconClass: 'pi-moon',
});
const user = ref({
  name: '',
  email: emailSignup.value,
  password: '',
  c_password: '',
  remember: false,
});
const error = ref({
  email: false,
  password: false,
  password_confirmation: false,
  showMessage: false,
  message: '',
});
const userAuthenticated = computed(() => authStore.isAuthenticated);

const schema = computed(() => {
  return {
    name: {
      required: required,
      minLength: minLength(3),
    },
    password: {
      required: required,
      minLength: minLength(8),
    },
    c_password: {
      required: required,
      minLength: minLength(8),
      sameAsPassword: sameAs(user.value.password),
    },
  };
});

const v$ = useVuelidate(schema, user);

if (userAuthenticated.value) {
  router.push('/dashboard');
}

onMounted(async () => {
  if (!token) {
    router.push('/login');
  }

  await authStore.verifyToken(token);
});

const onThemeToggler = (): void => {
  const root = document.getElementsByTagName('html')[0];

  root.classList.toggle('p-dark');
  button.value.iconClass = button.value.iconClass === 'pi-moon' ? 'pi-sun' : 'pi-moon';
  localStorage.setItem('theme', root.classList.contains('p-dark') ? 'dark' : 'light');
};


  const signup = async (): Promise<void> => {
  console.log(user);
  v$.value.$validate().then(() => {
    console.log(v$.value.$error);
    if (v$.value.$error) {
      return;
    }

    if (user.value.email != emailSignup.value) {
      window.location.reload()
    }

    authStore.signup(user).then((response) => {
      $toast.add({ severity: 'contrast', icon: 'pi-check', success: true, summary: t('setup.success'), detail: t('modules.signup.create.success'), life: 5000 });
      router.push({ path: '/dashboard' });
    }).catch((error) => {
      // console.log(error);
      // if (error.response.status === 500) {
      //   error500.value = true;
      // }
    });
  });
};
</script>

<style lang="scss">
.pw-input-full input {
  width: 100%;
}

.invalid {
  color: red;
}

.valid {
  color: green;
}

.black {
  color: black;
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

      <Transition name="fade">
        <Message class="w-full" severity="error" closable v-if="error500">
          {{ $t('modules.signup.error.500') }}
        </Message>
      </Transition>
      
      <div class="flex flex-col gap-6 w-full">
        <div class="flex flex-col gap-2">
          <label for="email">{{ $t('fields.contact.email') }}</label>
          <span>{{ emailSignup }}</span>
        </div>
        <div class="flex flex-col gap-2">
          <label for="name">{{ $t('fields.name') }}</label>
          <InputText id="name" v-model="user.name" :placeholder="$t('fields.contact.name_placeholder')" class="dark:!bg-surface-900" :invalid="error.name" />
          <TransitionFade>
            <small v-for="error in v$.name.$errors" v-if="v$.name.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
          </TransitionFade>
        </div>
        <div class="flex flex-col gap-2">
          <label for="password">{{ $t('fields.password') }}</label>
          <Password :feedback="true" toggleMask id="password" v-model="user.password" :placeholder="$t('fields.password_placeholder')"
          :promptLabel="$t('fields.password_prompt_label')" :weakLabel="$t('fields.password_weak')" :mediumLabel="$t('fields.password_medium')" :strongLabel="$t('fields.password_strong')" 
            class="dark:!bg-surface-900 pw-input-full" :invalid="error.password" pt:pcInput:class="w-full" pt:pcInput:id="password">
            <template #header></template>
            <template #footer>
              <Divider />
              <ul class="pl-2 ml-2 mt-0" style="line-height: 1.5">
                <li :class="{ invalid: !/[a-z]/.test(user.password) && user.password, valid: /[a-z]/.test(user.password), black: user.password == null }">{{ $t('fields.password_lowercase') }}</li>
                <li :class="{ invalid: !/[A-Z]/.test(user.password) && user.password, valid: /[A-Z]/.test(user.password), black: user.password == null }">{{ $t('fields.password_uppercase') }}</li>
                <li :class="{ invalid: !/[0-9]/.test(user.password) && user.password, valid: /[0-9]/.test(user.password), black: user.password == null }">{{ $t('fields.password_number') }}</li>
                <li :class="{ invalid: !/[^a-zA-Z0-9\s]/.test(user.password) && user.password, valid: /[^a-zA-Z0-9\s]/.test(user.password), black: user.password == null }">{{ $t('fields.password_special') }}</li> 
                <li :class="{ invalid: user.password.length < 8, valid: user.password && user.password.length >= 8, black: user.password == null }">{{ $t('fields.password_length') }}</li>
              </ul>
            </template>
          </Password>
          <TransitionFade>
            <small v-for="error in v$.password.$errors" v-if="v$.password.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
          </TransitionFade>
        </div>
        <div class="flex flex-col gap-2">
          <label for="c_password">{{ $t('fields.password_confirmation') }}</label>
          <Password :feedback="false" toggleMask id="c_password" v-model="user.c_password" :placeholder="$t('fields.password_confirmation_placeholder')" class="dark:!bg-surface-900 pw-input-full" :invalid="error.password" pt:pcInput:class="w-full" pt:pcInput:id="password" />
          <TransitionFade>
            <small v-for="error in v$.c_password.$errors" v-if="v$.c_password.$error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
          </TransitionFade>
        </div>
      </div>
      <Button :label="$t('setup.buttons.signup')" class="w-full" @click="signup" />
    </div>
  </div>
</template>