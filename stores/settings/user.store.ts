import { defineStore } from 'pinia';
import type { IUser } from '@/types/user.types';

export type UserStoreState = {
  user: IUser | null;
  isLoading: boolean; 
  error: string | null;  
};

export const useUserStore = defineStore({
  id: 'userStore',
  state: (): UserStoreState => ({
    user: null,
    isLoading: true,
    error: null,
  }),
  getters: {},
  actions: {
    setUser(user: IUser | null): void {
      this.user = user;
    },
    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    async getUsers(): Promise<any> {
    }
  }
});