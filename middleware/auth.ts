import { compileScript } from "vue/compiler-sfc";

export default defineNuxtRouteMiddleware(async (to, from) => {
  // now we are on the client side (second middleware execution)
  // we have access to localStorage
  if (import.meta.client) {
    const authStore = useAuthStore();
    // If not authenticated, attempt to fetch user data
    try {
      const response = await $fetch('/api/auth', {
        method: 'GET',
        query: {
          token: localStorage.sessionId,
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
      console.log(error);
      if (error.status == 401 || error.status == 403 || error.status == 500) {
        console.log(error);
        if (to.path !== '/login' && to.path !== '/signup') {
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
  }
});