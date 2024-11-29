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
          <div class="loading-container">
            <div class="loading-ring"></div>
          </div>
        </div>
        <NuxtPage v-else />
      </TransitionFade>
    </NuxtLayout>
  </div>
</template>