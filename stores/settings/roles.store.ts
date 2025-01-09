import { defineStore } from 'pinia';
import type { IRolesAndPermissionsResponse } from '~/types/role.types';

export type RoleStoreState = {
  data: IRolesAndPermissionsResponse | null;
  isLoading: boolean; 
  error: string | null;
};

export const useRoleStore = defineStore({
  id: 'roleStore',
  state: (): RoleStoreState => ({
    data: null,
    isLoading: true,
    error: null,
  }),
  getters: {},
  actions: {
    setRoles(data: IRolesAndPermissionsResponse | null): void {
      this.data = data;
    },
    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    async getUserRole(): Promise<any> {
    },
    async fetchData(params: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        params = params
          ? `${params}&action=get_roles&token=${localStorage.sessionId}`
          : `action=get_roles&token=${localStorage.sessionId}`;
        const data = await $fetch<IRolesAndPermissionsResponse[]>(`/api/role?${params}`, { method: "GET" });
        this.setRoles(data);
      } catch (error: any) {
        console.error(error);
        this.error = error.data.message || "An error occurred while fetching role";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  }
});