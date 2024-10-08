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
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>