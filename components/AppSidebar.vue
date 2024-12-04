<script setup lang="ts">
const authStore = useAuthStore();
const route = useRoute();

const loading = ref(true);

const user = computed(() => authStore.authUser);

const sidebarLinks = ref([{
  name: 'modules.dashboard.title',
  icon: 'pi pi-chart-bar',
  url: '/dashboard',
},
{
  name: 'modules.reports.title',
  icon: 'pi pi-chart-line',
  isOpen: ref(route.path.toString().includes('/reports') || route.path.toString().includes('/revenue') || route.path.toString().includes('/expenses')),
  children: [
    {
      name: 'modules.reports.revenue.title',
      icon: 'pi pi-table',
      isOpen: ref(route.path.toString().includes('/revenue')),
      children: [
        {
          name: 'common.view',
          icon: 'pi pi-table',
          url: '/reports/revenue/view',
        },
        {
          name: 'common.search',
          icon: 'pi pi-search',
          url: '/reports/revenue/search',
        },
      ],
    },
    {
      name: 'modules.reports.expenses.title',
      icon: 'pi pi-chart-line',
      url: '/reports/expenses',
    },
  ]
},
{
  name: 'modules.carriers.title',
  icon: 'pi pi-truck',
  isOpen: ref(route.path.toString().includes('/carriers')),
  children: [
    {
      name: 'modules.carriers.manage.title',
      icon: 'pi pi-table',
      url: '/carriers',
    },
    {
      name: 'modules.carriers.import.title',
      icon: 'pi pi-file-import',
      url: '/carriers/import',
    },
  ],
},
{
  name: 'modules.invoices.title',
  icon: 'pi pi-file',
  url: '/invoices',
},
{
  name: 'modules.events.title',
  icon: 'pi pi-calendar',
  url: '/events',
},
{
  name: 'modules.options.title',
  icon: 'pi pi-cog',
  url: '/options',
},
]);

const profile = ref({
  isOpen: false,
});

watch((user), () => {
  loading.value = false;
});

  const toggleMenu = (link: any, child: boolean = false): void => {

  sidebarLinks.value.forEach(topLevelLink => {
    if (topLevelLink.name !== link.name && !child) {
      topLevelLink.isOpen = false;

      if (topLevelLink.children) {
        topLevelLink.children.forEach((childLink: any) => {
          childLink.isOpen = false;
        });
      }
    }
  });

  link.isOpen = !link.isOpen;
};
</script>

<template>
  <div id="app-sidebar"
    class="w-[280px] bg-surface-900 h-screen hidden lg:block flex-shrink-0 absolute lg:fixed left-0 top-0 z-10 select-none">
    <div class="flex flex-col h-full">
      <div class="h-[60px] flex items-center px-8 bg-surface-950 flex-shrink-0 dark:border-b border-surface">
        <TransitionFade group>
          <Skeleton v-if="loading" height="48px" />
          <div v-else class="flex items-center">
            <svg height="36" viewBox="0 0 48 50" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd"
                d="M33.1548 9.65956L23.9913 4.86169L5.54723 14.5106L0.924465 12.0851L23.9913 0L37.801 7.23403L33.1548 9.65956ZM23.9931 19.3085L42.4255 9.65955L47.0717 12.0851L23.9931 24.1595L10.1952 16.9361L14.8297 14.5106L23.9931 19.3085ZM4.6345 25.8937L0 23.4681V37.9149L23.0669 50V45.1489L4.6345 35.4894V25.8937ZM18.4324 28.2658L0 18.6169V13.7658L23.0669 25.8403V40.2977L18.4324 37.8615V28.2658ZM38.7301 23.468V18.6169L24.9205 25.8403V49.9999L29.555 47.5743V28.2659L38.7301 23.468ZM43.3546 35.4892V16.1914L48.0008 13.7659V37.9148L34.1912 45.1488V40.2977L43.3546 35.4892Z"
                class="fill-white" />
            </svg>
            <span class="font-medium text-lg text-white ml-2">{{ $t('hermes_tms') }}</span>
          </div>
        </TransitionFade>
      </div>
      <div class="overflow-y-auto mt-4">
        <Transition name="fade" mode="out-in">
          <div v-if="loading" class="p-4 m-0">
            <Skeleton v-for="i in 5" v-if="loading" width="100%" height="53px" class="mb-4" />
          </div>
          <ul v-else class="list-none p-4 m-0">
            <li v-for="link in sidebarLinks" :key="link.name" :class="link.children ? 'relative': ''">
              <NuxtLink v-if="!link.children" :to="link.url"
                class="flex items-center cursor-pointer p-4 my-1 rounded-border hover:bg-surface-800 text-surface-300 hover:text-white duration-150 transition-colors">
                <i class="pi mr-2" :class="link.icon" />
                <span class="font-medium">{{ $t(link.name) }}</span>
                </NuxtLink>
              <a v-else @click="toggleMenu(link)"
                class="flex items-center cursor-pointer p-4 my-1 rounded-border hover:bg-surface-800 text-surface-300 hover:text-white duration-150 transition-colors">
                <i class="pi mr-2" :class="link.icon" />
                <span class="font-medium">{{ $t(link.name) }}</span>
                <i class="pi ml-auto transition-all duration-200 pi-chevron-left" :class="link.isOpen ? '-rotate-90' : ''" />
              </a>
              <TransitionExpand>
                <ul v-if="link.isOpen" class="list-none py-0 pl-4 pr-0 m-0 overflow-y-hidden">
                  <li v-for="child_link in link.children" :key="child_link.name">
                    <div v-if="child_link.children">
                      <a @click="toggleMenu(child_link, true)"
                        class="flex items-center cursor-pointer p-4 my-1 rounded-border hover:bg-surface-800 text-surface-300 hover:text-white duration-150 transition-colors">
                        <i class="pi mr-2" :class="child_link.icon" />
                        <span class="font-medium">{{ $t(child_link.name) }}</span>
                        <i class="pi ml-auto transition-all duration-200 pi-chevron-left text-surface-300"
                          :class="child_link.isOpen ? '-rotate-90' : ''" />
                      </a>
                        <TransitionExpand>
                          <ul v-if="child_link.isOpen" class="list-none py-0 pl-4 pr-0 m-0 overflow-y-hidden">
                            <li v-for="sub_child_link in child_link.children" :key="sub_child_link.name">
                              <NuxtLink :to="sub_child_link.url"
                                class="flex items-center cursor-pointer p-4 my-1 rounded-border hover:bg-surface-800 text-surface-300 hover:text-white duration-150 transition-colors">
                                <i class="pi mr-2" :class="sub_child_link.icon" />
                                <span class="font-medium">{{ $t(sub_child_link.name) }}</span>
                              </NuxtLink>
                            </li>
                          </ul>
                        </TransitionExpand>
                      </div>
                      <NuxtLink v-else :to="child_link.url"
                        class="flex items-center cursor-pointer p-4 my-1 rounded-border hover:bg-surface-800 text-surface-300 hover:text-white duration-150 transition-colors">
                        <i class="pi mr-2" :class="child_link.icon" />
                        <span class="font-medium">{{ $t(child_link.name) }}</span>
                      </NuxtLink>
                  </li>
                </ul>
              </TransitionExpand>
            </li>
          </ul>
        </Transition>
      </div>
      <div class="mt-auto">
        <hr class="mb-4 mx-4 border-t border-0 border-surface-600" />
        <ul 
          class="list-none p-2 m-0 origin-bottom animate-duration-150 overflow-hidden animate-ease-in-out" 
            :class="{ 
              'hidden': route.path !== '/settings'
            }"
          >
          <li>
            <NuxtLink :to="`/settings`"
              class="flex items-center cursor-pointer p-4 rounded-border hover:bg-surface-800 text-surface-300 hover:text-white duration-150 transition-colors">
              <i class="pi pi-cog mr-2" />
              <span class="font-medium">{{ $t('modules.settings.title') }}</span>
            </NuxtLink>
          </li>
        </ul>
        <a v-styleclass="{
          selector: '@prev',
          enterFromClass: 'hidden',
          enterActiveClass: 'animate-slidedown',
          leaveToClass: 'hidden',
          leaveActiveClass: 'animate-slideup'
        }" @click="profile.isOpen = !profile.isOpen"
          class="rounded m-4 px-4 py-2 flex items-center hover:bg-surface-700 cursor-pointer text-surface-300 duration-150 transition-colors">
          <Skeleton v-if="loading" width="48px" height="48px" class="mr-2" />
          <img v-else :src="user?.shipper.logo_image_url" class="mr-2 w-12 h-12 rounded" />
          <Skeleton v-if="loading" width="8rem" height="1.5rem" />
          <span v-else class="font-medium">{{ user?.shipper.name }}</span>
          <i class="pi ml-auto transition-transform duration-200 pi-chevron-left" :class="profile.isOpen ? 'rotate-90' : ''" />
        </a>
      </div>
    </div>
  </div>
</template>