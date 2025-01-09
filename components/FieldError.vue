<script setup lang="ts">
const props = defineProps<{
  errors: any;
  error: any;
}>();
</script>

<template>
  <small v-for="error in errors" v-if="error" :id="error.$message.toString()" class="text-red-500">{{ error.$message }}</small>
</template>