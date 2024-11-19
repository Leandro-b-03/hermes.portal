<script setup lang="ts">
</script>

<template>
  <div class="grid grid-cols-12 gap-4 grid-nogutter border-t border-surface pt-2">
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">Name</div>
      <div class="text-surface-900 dark:text-surface-0">Elliot Alderson</div>
    </div>
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">Email</div>
      <div class="text-surface-900 dark:text-surface-0">elliot.alderson@email.com</div>
    </div>
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">Applied Position</div>
      <div class="text-surface-900 dark:text-surface-0">Front-End Developer</div>
    </div>
    <div class="col-span-12 md:col-span-6 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">Salary Expectation</div>
      <div class="text-surface-900 dark:text-surface-0">$150,000</div>
    </div>
    <div class="col-span-12 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-2">Bio</div>
      <div class="text-surface-900 dark:text-surface-0 leading-normal">
        Faucibus pulvinar elementum integer enim neque volutpat ac tincidunt vitae. Commodo odio aenean sed adipiscing diam donec adipiscing tristique. Eget felis eget nunc lobortis mattis aliquam faucibus purus in.
      </div>
    </div>
    <div class="col-span-12 p-4">
      <div class="text-surface-500 dark:text-surface-300 font-medium mb-4">Files</div>
      <div class="flex md:items-center md:justify-between border-t border-surface p-4 flex-col md:flex-row">
        <div class="flex items-center">
          <span class="block pi pi-file mr-2" />
          <span class="text-surface-900 dark:text-surface-0">resume_en.pdf</span>
        </div>
        <Button icon="pi pi-download" label="Download" class="mt-2 md:mt-0" outlined />
      </div>
      <div class="flex md:items-center md:justify-between border-t border-b border-surface p-4 flex-col md:flex-row">
        <div class="flex items-center">
          <span class="block pi pi-file mr-2" />
          <span class="text-surface-900 dark:text-surface-0">cover_letter_en.pdf</span>
        </div>
        <Button icon="pi pi-download" label="Download" class="mt-2 md:mt-0" outlined />
      </div>
  </div>
</div>
</template>