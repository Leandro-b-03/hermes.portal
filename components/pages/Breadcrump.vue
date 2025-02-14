<script setup lang="ts">
const props = defineProps<{
  links: string[];
  loading: boolean;
}>();
</script>

<template>
  <Transition name="fade" mode="out-in">
    <Skeleton v-if="loading" height="3.4rem" />
    <ul v-else
      class="list-none p-0 m-0 bg-surface-0 dark:bg-surface-900 flex font-medium overflow-y-hidden overflow-x-auto rounded-lg shadow-sm">
      <li v-for="(name, index) in links" :key="index" class="relative p-4">
        <div class="breadcrump">
          <div v-if="index > 0" class="absolute left-0 top-0 z-10 border-l-[20px] border-l-surface-0 dark:border-l-surface-900 w-0 h-0 border-t-[26px] border-t-transparent border-b-[26px] border-b-transparent"></div>
          <NuxtLink :to="!name.includes('name-') && !name.includes('edit') ? `/${name}` : ''" class="cursor-pointer whitespace-nowrap pl-6' text-black dark:text-surface-0" :class="index > 0 ? 'pl-4' : ''">
            <i v-if="name == 'dashboard'" class="pi pi-objects-column" v-tooltip.top="$t('modules.dashboard.title')"></i>
            <span v-else-if="name.includes('name')">{{ name.replace(/^.*name-/, '') }}</span>
            <span v-else>{{ $t(`modules.${name}.title`) }}</span>
          </NuxtLink>
          <div v-if="index > 0" class="absolute top-0 border-l-[20px] border-l-surface-200 dark:border-l-surface-700 w-0 h-0 border-t-[26px] border-t-transparent border-b-[26px] border-b-transparent left-px"></div>
        </div>
      </li>
    </ul>
  </Transition>
</template>