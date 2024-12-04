<script setup lang="ts">
</script>

<template>
  <div class="overflow-x-scroll">
    <DataTable :value="members" row-hover>
      <Column class="min-w-[25rem]">
        <template #header>
          <span class="font-semibold text-sm text-muted-color">Name</span>
        </template>
        <template #body="{ data }">
          <div class="flex items-center gap-4">
            <Avatar :image="'https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle/' + data.image + '.png'" class="mr-2" size="large" shape="circle" />
            <div>
              <p class="mt-0 mb-2 font-medium text-lg text-color-primary">
                {{ data.name }}
              </p>
              <p class="mt-0 mb-2 font-normal text-base text-muted-color">
                {{ data.username }}
              </p>
            </div>
          </div>
        </template>
      </Column>
      <Column class="min-w-56">
        <template #header>
          <span class="font-semibold text-sm text-muted-color">Joined Date</span>
        </template>
        <template #body="{ data }">
          <p class="mt-0 mb-2 font-normal text-base text-muted-color">
            {{ data.date }}
          </p>
        </template>
      </Column>
      <Column class="min-w-[13rem]">
        <template #header>
          <span class="font-semibold text-sm text-muted-color">Last Active</span>
        </template>
        <template #body="{ data }">
          <p class="mt-0 mb-2 font-normal text-base text-muted-color">
            {{ data.active }}
          </p>
        </template>
      </Column>
      <Column class="min-w-32">
        <template #body>
          <Button type="button" icon="pi pi-ellipsis-v" text severity="secondary" @click="$refs.menu.toggle($event)" />
          <Menu ref="menu" append-to="body" popup :model="items" />
        </template>
      </Column>
    </DataTable>
  </div>
</template>