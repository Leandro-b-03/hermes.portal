<script setup lang="ts">
import type { NuxtError } from '#app'

definePageMeta({
  layout: 'default',
});

const props = defineProps({
  error: Object as () => NuxtError
});

const statusCode = props.error?.statusCode;
const title = ref('');
const message = ref('');
const transition = ref(true);

if (props.error?.statusCode === 404) {
  title.value = 'setup.error.404.title';
  message.value = 'setup.error.404.message';
}

if (props.error?.statusCode === 500) {
  title.value = 'setup.error.500.title';
  message.value = 'setup.error.500.message';
}

if (props.error?.data?.message) {
  title.value = props.error.data.name;
  message.value = props.error.data.message;
}

onMounted(() => {
  setTimeout(() => {
    transition.value = false;
  }, 200);  
})

watch(() => props.error, () => {
  transition.value = true;

  setTimeout(() => {
    transition.value = false;
  }, 200);
});
</script>

<template>
  <NuxtLayout>
    <TransitionFade group>
      <div v-if="transition" class="h-screen w-full flex items-center justify-center">
        <div class="loading-container">
          <div class="loading-ring"></div>
        </div>
      </div>
      <PagesError v-else :statusCode="statusCode" :title="title" :message="message" />
    </TransitionFade>
  </NuxtLayout>
</template>