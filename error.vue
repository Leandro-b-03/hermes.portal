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
</script>

<template>
  <NuxtLayout>
    <PagesError :statusCode="statusCode" :title="title" :message="message" />
  </NuxtLayout>
</template>