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
});