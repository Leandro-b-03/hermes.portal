<script setup lang="ts">
const links = defineProps<{
  name: string;
  index: number;
}>();
</script>

<template>
  <div class="breadcrump">
    <div v-if="index > 0" class="absolute left-0 top-0 z-10 border-l-[20px] border-l-surface-0 dark:border-l-surface-900 w-0 h-0 border-t-[26px] border-t-transparent border-b-[26px] border-b-transparent"></div>
    <NuxtLink :to="!name.includes('name-') && !name.includes('edit') ? `/${name}` : ''" class="cursor-pointer whitespace-nowrap pl-6' text-black dark:text-surface-0" :class="index > 0 ? 'pl-4' : ''">
      <i v-if="name == 'dashboard'" class="pi pi-objects-column"></i>
      <span v-else-if="name.includes('name')">{{ name.replace('name-', '') }}</span>
      <span v-else>{{ $t(`breadcrump.${name}`) }}</span>
    </NuxtLink>
    <div v-if="index > 0" class="absolute top-0 border-l-[20px] border-l-surface-200 dark:border-l-surface-700 w-0 h-0 border-t-[26px] border-t-transparent border-b-[26px] border-b-transparent left-px"></div>
  </div>
</template>