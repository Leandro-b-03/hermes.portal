export default defineNuxtRouteMiddleware(async (to, from) => {
  const useAuth = useAuthStore();

  if (import.meta.server) return;

  if (import.meta.client) {
    if (!useAuth.isAuthenticated) {
      try {
        const response = await $fetch('/api/auth', { method: 'GET', query: { token: sessionStorage.sessionId, action: 'current_user' } });
      
        const customer = response.user
        useAuth.setAuthUser(customer);

        if (!customer) {
          return navigateTo('/login', {external: true});
        }
      } catch (error) {
        console.error(error);
        return navigateTo('/login', {external: true});
      }
    }
  }
});