<script setup lang="ts">
const route = useRoute();

const transition = ref(true);

if (import.meta.client)
  localStorage.getItem('theme') === 'dark' && document.getElementsByTagName('html')[0].classList.add('p-dark');

onMounted(() => {
  setTimeout(() => {
    transition.value = false;
  }, 200);  
})

watch(() => route.path, () => {
  transition.value = true;

  setTimeout(() => {
    transition.value = false;
  }, 200);
});
</script>

<template>
  <div>
    <Toast>
      <template #message="slotProps" class="mt-10">
        <div class="flex flex-col items-start flex-auto" :class="slotProps.message.success ? 'text-green-500' : 'text-red-500'">
          <div class="font-medium text-lg">
            <i class="pi mr-2" :class="slotProps.message.icon"></i>
            <span>{{ slotProps.message.summary }}</span>
          </div>
        <div>{{ slotProps.message.detail }}</div>
        </div>
      </template>
    </Toast>
    <NuxtLayout>
      <TransitionFade group>
        <div v-if="transition" class="h-screen w-full flex items-center justify-center">
          <div class="flex flex-col items-center justify-center h-screen">
            <svg class="mb-4 fill-surface-600 dark:fill-surface-200 h-14" viewBox="0 0 30 32" fill="none"
              xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M20.7207 6.18211L14.9944 3.11148L3.46855 9.28678L0.579749 7.73444L14.9944 0L23.6242 4.62977L20.7207 6.18211ZM14.9996 12.3574L26.5182 6.1821L29.4216 7.73443L14.9996 15.4621L6.37724 10.8391L9.27337 9.28677L14.9996 12.3574ZM2.89613 16.572L0 15.0196V24.2656L14.4147 32V28.8953L2.89613 22.7132V16.572ZM11.5185 18.09L0 11.9147V8.81001L14.4147 16.5376V25.7904L11.5185 24.2312V18.09ZM24.2086 15.0194V11.9147L15.5788 16.5377V31.9998L18.475 30.4474V18.09L24.2086 15.0194ZM27.0969 22.7129V10.3623L30.0004 8.81V24.2653L21.3706 28.895V25.7904L27.0969 22.7129Z" />
            </svg>
            <h1 class="text-3xl font-bold mt-4">{{ $t('hermes_tms') }}</h1>
          </div>
        </div>
        <NuxtPage v-else />
      </TransitionFade>
    </NuxtLayout>
  </div>
</template>