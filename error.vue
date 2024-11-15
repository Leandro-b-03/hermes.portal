<script setup lang="ts">
import type { NuxtError } from '#app'

definePageMeta({
  layout: 'default',
});

const props = defineProps({
  error: Object as () => NuxtError
});

if (props.error?.statusCode === 404) {
  console.log('404 error');
  props.error.name = 'setup.error.404.title';
  props.error.statusMessage = 'setup.error.404.message';
}

if (props.error?.statusCode === 500) {
  console.log('500 error');
  props.error.name = 'setup.error.500.title';
  props.error.statusMessage = 'setup.error.500.message';
}

if (props.error?.data?.message) {
  console.log('error message:', props.error.data.message);
  props.error.name = props.error.data.name;
  props.error.statusMessage = props.error.data.message;
}

console.log(props.error);
</script>

<template>
  <NuxtLayout>
    <PagesError :statusCode="error?.statusCode" :title="error?.name" :message="error?.statusMessage" />
  </NuxtLayout>
</template>