import { defineStore } from 'pinia';
import { v4 as uuidv4 } from 'uuid';
import type { IUser } from '@/types/user.types';
import { verify } from 'jsonwebtoken';

export type AuthStoreState = {
  authUser: IUser | null;
  signupEmail: string | null;
  isLoading: boolean; 
  error: string | null;  
};

export const useAuthStore = defineStore({
  id: 'authStore',
  state: (): AuthStoreState => ({
    authUser: null,
    signupEmail: null,
    isLoading: true,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.authUser,
  },
  actions: {
    setAuthUser(user: IUser | null): void {
      this.authUser = user;
    },
    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    setSignupEmail(signupEmail: string | null): void {
      this.signupEmail = signupEmail;
    },
    startSession(): void {
      const storedSessionId = localStorage.sessionId || null;

      if (!storedSessionId) {
        localStorage.sessionId = uuidv4();
      }
    },
    hasPermission(permission: string): boolean {  
      if (this.authUser?.roles[0].name === 'admin') return true;
      
      // Otherwise, check if the user has the specific permission
      const userPermissions = this.authUser.roles[0].permissions.map(p => p.name)
      if (!userPermissions) return false;

      return userPermissions.includes(permission)
    },
    hasModule (module: string): boolean {
      console.log(module);
      const userModules = this.authUser.modules.map(p => p.slug)
      if (!userModules) return false;

      console.log(userModules);

      return userModules.includes(module)
    },
    async login(user_data: []): Promise<any> {
      this.isLoading = true;
      this.error = null;

      this.startSession();

      try {
        const body = { token: localStorage.sessionId, action: 'sign_in', user: user_data };
        const user = await $fetch('/api/auth', { method: 'POST', body: body });
        this.setAuthUser(user);
        localStorage.authenticated = true;
        return true;
      } catch (error: any) {
        this.error = error.response.data.error || 'An error occurred during login';
        localStorage.authenticated = false;
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async verifyToken(token: string): Promise<any> {
      this.isLoading = true;
      this.error = null;
      const valid = ref(true);
      try {
        const response = await $fetch('/api/auth', { method: 'GET', query: { token_code: token, action: 'verify_sign_up_token' } });
        console.log(response);
        this.setSignupEmail(response?.email);
      } catch (error: any) {
        this.error = error.message || 'Failed to verify token';
        this.setAuthUser(null);
        localStorage.authenticated = false;
        valid.value =  false;
      } finally {
        this.isLoading = false;
      }

      return valid.value;
    },
    async signup(user_data: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;
      
      this.startSession();

      try {
        user_data.append('action', 'sign_up');
        user_data.append('token', localStorage.sessionId);
        const user = await $fetch('/api/auth', { method: 'POST', body: user_data });
        this.setAuthUser(user);
        localStorage.authenticated = true;
      } catch (error: any) {
        console.log(error);
        this.error = error.data.message || 'An error occurred during signup';
        localStorage.authenticated = false;
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchMe(): Promise<void> { 
      this.isLoading = true;
      this.error = null;

      const storedSessionId = localStorage.sessionId || null;

      if (!storedSessionId) {
        localStorage.sessionId = uuidv4();
      }

      try {
        const response = await $fetch('/api/auth', { method: 'GET', query: { token: localStorage.sessionId, action: 'current_user' } });

        this.setAuthUser(response?.user);
        localStorage.authenticated = true;
      } catch (error: any) {
        this.error = error.message || 'Failed to fetch user information';
        this.setAuthUser(null);
        localStorage.authenticated = false;
      } finally {
        this.isLoading = false;
      }
    },
    async socialLogin(data: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        const user = await $fetch('/api/auth', { method: 'POST', body: { token: localStorage.sessionId, action: 'google_oauth2/callback', ...data } });
        this.setAuthUser(user);
        localStorage.authenticated = true;
      } catch (err) {
        this.error = err.message || 'An error occurred during social login';
        localStorage.authenticated = false;
      } finally {
        this.isLoading = false;
      }
    },
    async logout() {
      const response = await $fetch('/api/auth', { method: 'DELETE', body: { token: localStorage.sessionId, action: 'sign_out' } });
      if (response.success) {
        this.setAuthUser(null);
      }

      localStorage.authenticated = false;

      return response;
    },
    async resetPassword(data: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;

      try {
        data.append('action', 'reset_password');
        data.append('token', localStorage.sessionId);
        console.log(data);
        await $fetch('/api/auth', { method: 'POST', body: data });
      } catch (error: any) {
        if (error.status == 429) {
          this.error = 'modules.settings.members.reset_password.errors.429'
        } else if (error.status == 500) {
          this.error = 'modules.settings.members.reset_password.errors.500'
        }
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});