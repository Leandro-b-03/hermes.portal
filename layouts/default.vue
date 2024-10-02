<script setup lang="ts">
</script>

<template>
  <div class="min-h-screen flex relative lg:static bg-surface-50 dark:bg-surface-950 ml-[280px]">
    <AppSidebar />
    <div class="min-h-screen min-w-full flex flex-col relative flex-auto">
      <AppHeader />
      <div class="p-8 flex flex-col flex-auto mt-6">
        <slot />
      </div>
    </div>
  </div>
</template>