import { defineStore } from 'pinia';
import type { IShipper } from '@/types/shipper.types';

export type ShipperStoreState = {
  shipper: IShipper | null;
  isLoading: boolean; 
  error: string | null;  
};

export const useShipperStore = defineStore({
  id: 'shipperStore',
  state: (): ShipperStoreState => ({
    shipper: null,
    isLoading: true,
    error: null,
  }),
  getters: {},
  actions: {
    setShipper(shipper: IShipper | null): void {
      this.shipper = shipper;
    },
    setLoading(loading: boolean): void {
      this.isLoading = loading;
    },
    async getShipper(): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        const params = `action=get_shipper&token=${sessionStorage.sessionId}`;
        const shipper = await $fetch(`/api/shipper?${params}`, { method: 'GET' });
        this.setShipper(shipper);
        return shipper;
      } catch (error: any) {
        this.error = error.response.data.error || 'An error occurred during login';
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  }
});