<script setup lang="ts">
</script>

<template>
<Fluid>
      <div class="grid grid-cols-12 gap-4">
          <div class="mb-4 col-span-12 md:col-span-6">
              <label for="company_name" class="font-medium text-surface-900 dark:text-surface-0 block mb-1">{{ $t('carriers.fields.tax_id') }}</label>
              <InputGroup>
                <InputText id="company_name" type="text" :placeholder="$t('carriers.create.fields.tax_id_placeholder')" />
                <Button icon="pi pi-search" />
              </InputGroup>
          </div>
          <div class="border-surface border-t opacity-50 mb-4 col-span-12" />
      </div>
      <Button :label="$t('carriers.create.buttons.save')" icon="pi pi-truck" class="w-auto" />
</Fluid>
</template>