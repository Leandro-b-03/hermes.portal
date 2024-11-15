import { compileScript } from "vue/compiler-sfc";

export default defineNuxtRouteMiddleware(async (to, from) => {
  const authStore = useAuthStore();
  // If not authenticated, attempt to fetch user data
  try {
    const response = await $fetch('/api/auth', {
      method: 'GET',
      query: {
        token: sessionStorage.sessionId,
        action: 'current_user'
      }
    });

    const customer = response.user;
    authStore.setAuthUser(customer);

    if (!customer) {
      if (to.path !== '/login') {
        return navigateTo('/login');
      }
    }
  } catch (error) {
    if (error.status == 401) {
      if (to.path !== '/login') {
        return navigateTo('/login', { external: true });
      }
    }

    return;
  }

  // Check if the user is already authenticated
  if (authStore.isAuthenticated) {
    if (to.path === '/') {
      return navigateTo('/dashboard', { external: true });
    }
    return; // Allow access
  }
});