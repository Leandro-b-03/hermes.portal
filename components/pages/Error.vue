<script setup lang="ts">
const props = defineProps<{
  statusCode: number;
  title: string;
  message: string;
}>();

</script>

<template>
  <div class="bg-surface-50 dark:bg-surface-950 px-6 py-20 md:px-12 lg:px-20 -mt-16">
    <div class="shadow rounded-border bg-surface-0 dark:bg-surface-900 px-6 md:px-12 py-12">
      <div class="border-l-2 border-primary">
        <span class="bg-white dark:bg-surface-900 text-primary font-bold text-2xl inline-block px-4">{{ props.statusCode }}</span>
      </div>
      <div class="mt-12 mb-8 font-bold text-6xl text-surface-900 dark:text-surface-0">{{ $t(props.title) }}</div>
      <p class="text-surface-700 dark:text-surface-100 text-3xl mt-0 mb-12">{{ $t(props.message) }}</p>

      <ul class="list-none px-0 pb-0 pt-6 m-0 border-t border-surface">
        <li v-if="props?.statusCode !== 404" class="py-2">
          <NuxtLink :to="`https://localhost:5173/ticket${$route.path}`" class="cursor-pointer flex items-center rounded-border border border-transparent hover:border-surface-300 dark:hover:border-surface-500 p-4 transition-colors duration-150">
            <span class="w-14 h-14 inline-flex items-center justify-center bg-indigo-500 rounded-border flex-shrink-0">
              <i class="pi pi-envelope text-white text-3xl" />
            </span>
            <div class="ml-4">
              <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl inline-block mb-1">{{ $t('setup.ticket.title') }}</span>
              <p class="text-surface-600 dark:text-surface-200 m-0 leading-normal">{{ $t('setup.ticket.text') }}</p>
            </div>
            <i class="text-surface-600 dark:text-surface-200 pi pi-chevron-right ml-auto" />
          </NuxtLink>
        </li>
        <li class="py-2">
          <NuxtLink to="/dashboard" class="cursor-pointer flex items-center rounded-border border border-transparent hover:border-surface-300 dark:hover:border-surface-500 p-4 transition-colors duration-150">
            <span class="w-14 h-14 inline-flex items-center justify-center bg-orange-500 rounded-border flex-shrink-0">
              <i class="pi pi-chart-bar text-white text-3xl" />
            </span>
            <div class="ml-4">
              <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl inline-block mb-1">{{ $t('dashboard.title') }}</span>
              <p class="text-surface-600 dark:text-surface-200 m-0 leading-normal">{{ $t('dashboard.text') }}</p>
            </div>
            <i class="text-surface-600 dark:text-surface-200 pi pi-chevron-right ml-auto" />
          </NuxtLink>
        </li>
        <li class="pt-2">
          <NuxtLink to="/settings" class="cursor-pointer flex items-center rounded-border border border-transparent hover:border-surface-300 dark:hover:border-surface-500 p-4 transition-colors duration-150">
            <span class="w-14 h-14 inline-flex items-center justify-center bg-cyan-500 rounded-border flex-shrink-0">
              <i class="pi pi-cog text-white text-3xl" />
            </span>
            <div class="ml-4">
              <span class="text-surface-900 dark:text-surface-0 font-medium text-2xl inline-block mb-1">{{ $t('settings.title') }}</span>
              <p class="text-surface-600 dark:text-surface-200 m-0 leading-normal">{{ $t('settings.title') }}</p>
            </div>
            <i class="text-surface-600 dark:text-surface-200 pi pi-chevron-right ml-auto" />
          </NuxtLink>
        </li>
      </ul>
      <div class="flex justify-items-start mt-8">
        <Button class="mr-2" text label="Go Back" icon="pi pi-arrow-left" @click="$router.back()" />
      </div>
    </div>
  </div>
</template>