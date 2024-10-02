<template>
  <div class="p-8 flex flex-col flex-auto">
    <div class="grid grid-cols-12 gap-4">
      <div class="col-span-12">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-center bg-blue-500 rounded-xl">
              <span class="inline-flex justify-center items-center bg-blue-600 rounded-full mb-4 w-12 h-12 py-2">
                <i class="pi pi-inbox !text-xl leading-none text-white" />
              </span>
              <div class="text-2xl font-medium text-white mb-2">123K</div>
              <span class="text-blue-100 font-medium">Messages</span>
            </div>
          </div>
          <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-center bg-purple-500 rounded-xl">
              <span class="inline-flex justify-center items-center bg-purple-600 rounded-full mb-4 w-12 h-12 py-2">
                <i class="pi pi-map-marker !text-xl leading-none text-white" />
              </span>
              <div class="text-2xl font-medium text-white mb-2">23K</div>
              <span class="text-purple-100 font-medium">Check-ins</span>
            </div>
          </div>
          <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-center bg-indigo-500 rounded-xl">
              <span class="inline-flex justify-center items-center bg-indigo-600 rounded-full mb-4 w-12 h-12 py-2">
                <i class="pi pi-file !text-xl leading-none text-white" />
              </span>
              <div class="text-2xl font-medium text-white mb-2">23K</div>
              <span class="text-indigo-100 font-medium">Files</span>
            </div>
          </div>
          <div class="col-span-12 md:col-span-6 lg:col-span-3">
            <div class="p-4 text-center bg-orange-500 rounded-xl">
              <span class="inline-flex justify-center items-center bg-orange-600 rounded-full mb-4 w-12 h-12 py-2">
                <i class="pi pi-users !text-xl leading-none text-white" />
              </span>
              <div class="text-2xl font-medium text-white mb-2">40K</div>
              <span class="text-orange-100 font-medium">Users</span>
            </div>
          </div>
        </div>
      </div>
      <div class="col-span-12 lg:col-span-6">
        <div class="shadow bg-surface-0 dark:bg-surface-900 rounded-border p-6">
          <div class="flex items-center justify-between">
            <span class="text-xl font-medium text-surface-900 dark:text-surface-0">Traffic Distribution</span>
            <div class="ml-20">
              <Button icon="pi pi-ellipsis-v" text plain rounded @click="$refs.menu.toggle($event)" />
              <Menu ref="menu" :popup="true" :model="items" />
            </div>
          </div>
          <div class="mt-4">
            <div class="grid grid-cols-12 gap-4">
              <div class="col-span-12 md:col-span-6">
                <div class="text-center border border-surface rounded-border p-6">
                  <i class="pi pi-twitter text-5xl text-blue-500" />
                  <div class="text-surface-900 dark:text-surface-0 text-2xl font-700 my-4 font-bold">12.40K</div>
                  <span class="font-medium text-surface-600 dark:text-surface-200">Twitter</span>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6 text-center">
                <div class="text-center border border-surface rounded-border p-6">
                  <i class="pi pi-vimeo text-5xl text-blue-500" />
                  <div class="text-surface-900 dark:text-surface-0 text-2xl font-700 my-4 font-bold">10.20K</div>
                  <span class="font-medium text-surface-600 dark:text-surface-200">Vimeo</span>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6 text-center">
                <div class="text-center border border-surface rounded-border p-6">
                  <i class="pi pi-facebook text-5xl text-blue-500" />
                  <div class="text-surface-900 dark:text-surface-0 text-2xl font-700 my-4 font-bold">5.60K</div>
                  <span class="font-medium text-surface-600 dark:text-surface-200">Facebook</span>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6 text-center">
                <div class="text-center border border-surface rounded-border p-6">
                  <i class="pi pi-discord text-5xl text-indigo-500" />
                  <div class="text-surface-900 dark:text-surface-0 text-2xl font-700 my-4 font-bold">23.53K</div>
                  <span class="font-medium text-surface-600 dark:text-surface-200">Discord</span>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6 text-center">
                <div class="text-center border border-surface rounded-border p-6">
                  <i class="pi pi-github text-5xl text-purple-500" />
                  <div class="text-surface-900 dark:text-surface-0 text-2xl font-700 my-4 font-bold">16.70K</div>
                  <span class="font-medium text-surface-600 dark:text-surface-200">GitHub</span>
                </div>
              </div>
              <div class="col-span-12 md:col-span-6 text-center">
                <div class="text-center border border-surface rounded-border p-6">
                  <i class="pi pi-google text-5xl text-pink-500" />
                  <div class="text-surface-900 dark:text-surface-0 text-2xl font-700 my-4 font-bold">16.50K</div>
                  <span class="font-medium text-surface-600 dark:text-surface-200">Google</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-6">
        <div class="bg-surface-0 dark:bg-surface-900 shadow rounded-border p-6 h-full">
          <div class="flex items-center justify-between mb-6">
            <span class="text-xl font-medium text-surface-900 dark:text-surface-0">Quarter Goals</span>
            <div class="ml-auto">
              <Button icon="pi pi-ellipsis-v" text plain rounded @click="$refs.menu.toggle($event)" />
              <Menu ref="menu" :popup="true" :model="items" />
            </div>
          </div>
          <div class="border-surface border rounded-border p-4 mb-6">
            <span class="text-surface-900 dark:text-surface-0 font-medium text-3xl">85% <span
                class="text-surface-600 dark:text-surface-200">(2125/2500)</span></span>
            <ul class="mt-4 list-none p-0 mx-0 flex">
              <li class="h-4 flex-1 bg-indigo-500 rounded-l" />
              <li class="h-4 flex-1 bg-blue-500" />
              <li class="h-4 flex-1 bg-orange-500" />
              <li class="h-4 flex-1 bg-purple-500" />
              <li class="h-4 flex-1 bg-yellow-500" />
              <li class="h-4 flex-1 bg-cyan-500" />
              <li class="h-4 flex-1 bg-surface-500 dark:bg-surface-300 rounded-r" />
            </ul>
          </div>
          <ul class="mt-6 list-none p-0 mx-0">
            <li class="flex items-center pb-4">
              <span class="w-4 h-4 rounded-border bg-indigo-500 mr-4 flex-shrink-0" />
              <span class="text-xl font-medium text-90">Watch</span>
              <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">152</span>
            </li>
            <li class="flex items-center py-4">
              <span class="w-4 h-4 rounded-border bg-blue-500 mr-4 flex-shrink-0" />
              <span class="text-xl font-medium text-90">Blue Band</span>
              <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">63</span>
            </li>
            <li class="flex items-center py-4">
              <span class="w-4 h-4 rounded-border bg-orange-500 mr-4 flex-shrink-0" />
              <span class="text-xl font-medium text-90">Controller</span>
              <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">23</span>
            </li>
            <li class="flex items-center py-4">
              <span class="w-4 h-4 rounded-border bg-purple-500 mr-4 flex-shrink-0" />
              <span class="text-xl font-medium text-90">Lime Band</span>
              <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">42</span>
            </li>
            <li class="flex items-center py-4">
              <span class="w-4 h-4 rounded-border bg-yellow-500 mr-4 flex-shrink-0" />
              <span class="text-xl font-medium text-90">Phone Case</span>
              <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">134</span>
            </li>
            <li class="flex items-center py-4">
              <span class="w-4 h-4 rounded-border bg-cyan-500 mr-4 flex-shrink-0" />
              <span class="text-xl font-medium text-90">T-Shirt</span>
              <span class="text-surface-600 dark:text-surface-200 text-xl font-medium ml-auto">89</span>
            </li>
          </ul>
        </div>
      </div>
      <div class="col-span-12">
        <div class="grid grid-cols-12 gap-4">
          <div class="col-span-12 lg:col-span-4">
            <div class="shadow bg-surface-0 dark:bg-surface-900 rounded-border p-6 h-full">
              <div class="flex items-start mb-8">
                <img
                  src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle-big/avatar-m-1.png"
                  width="56" height="56" />
                <div class="ml-4">
                  <span class="block text-surface-900 dark:text-surface-0 mb-1 text-xl font-medium">Cameron
                    Williamson</span>
                  <p class="text-surface-600 dark:text-surface-200 mt-0 mb-0">Marketing Coordinator</p>
                </div>
              </div>
              <ul class="list-none p-0 m-0">
                <li class="mb-8">
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-twitter mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Twitter</span>
                    </span>
                    <span class="text-cyan-500 font-medium">34.00%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-cyan-500 h-full w-[34%] rounded" />
                  </div>
                </li>
                <li class="mb-8">
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-facebook mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Facebook</span>
                    </span>
                    <span class="text-indigo-500 font-medium">45.86%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-indigo-500 h-full rounded w-[45%]" />
                  </div>
                </li>
                <li>
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-google mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Google</span>
                    </span>
                    <span class="text-orange-500 font-medium">79.00%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-orange-500 h-full w-[79%] rounded" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
            <div class="shadow bg-surface-0 dark:bg-surface-900 rounded-border p-6 h-full">
              <div class="flex items-start mb-8">
                <img
                  src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle-big/avatar-f-2.png"
                  width="56" height="56" />
                <div class="ml-4">
                  <span class="block text-surface-900 dark:text-surface-0 mb-1 text-xl font-medium">Kathryn
                    Murphy</span>
                  <p class="text-surface-600 dark:text-surface-200 mt-0 mb-0">Sales Manager</p>
                </div>
              </div>
              <ul class="list-none p-0 m-0">
                <li class="mb-8">
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-twitter mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Twitter</span>
                    </span>
                    <span class="text-cyan-500 font-medium">64.47%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-cyan-500 h-full w-[64%] rounded" />
                  </div>
                </li>
                <li class="mb-8">
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-facebook mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Facebook</span>
                    </span>
                    <span class="text-indigo-500 font-medium">75.67%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-indigo-500 h-full w-[75%] rounded" />
                  </div>
                </li>
                <li>
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-google mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Google</span>
                    </span>
                    <span class="text-orange-500 font-medium">45.00%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-orange-500 h-full w-[45%] rounded" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-span-12 lg:col-span-4">
            <div class="shadow bg-surface-0 dark:bg-surface-900 rounded-border p-6 h-full">
              <div class="flex items-start mb-8">
                <img
                  src="https://fqjltiegiezfetthbags.supabase.co/storage/v1/render/image/public/block.images/blocks/avatars/circle-big/avatar-m-3.png"
                  width="56" height="56" />
                <div class="ml-4">
                  <span class="block text-surface-900 dark:text-surface-0 mb-1 text-xl font-medium">Darrell
                    Steward</span>
                  <p class="text-surface-600 dark:text-surface-200 mt-0 mb-0">Web Designer</p>
                </div>
              </div>
              <ul class="list-none p-0 m-0">
                <li class="mb-8">
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-twitter mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Twitter</span>
                    </span>
                    <span class="text-cyan-500 font-medium">23.55%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-cyan-500 h-full w-[34%] rounded" />
                  </div>
                </li>
                <li class="mb-8">
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-facebook mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Facebook</span>
                    </span>
                    <span class="text-indigo-500 font-medium">78.65%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-indigo-500 h-full w-[45%] rounded" />
                  </div>
                </li>
                <li>
                  <div class="flex justify-between items-center">
                    <span class="text-surface-900 dark:text-surface-0 inline-flex justify-between items-center">
                      <i class="pi pi-google mr-2" />
                      <span class="font-medium text-surface-900 dark:text-surface-0">Google</span>
                    </span>
                    <span class="text-orange-500 font-medium">86.54%</span>
                  </div>
                  <div class="bg-surface-200 dark:bg-surface-700 w-full mt-2 h-[7px] rounded">
                    <div class="bg-orange-500 h-full w-[79%] rounded" />
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
