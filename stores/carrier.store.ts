import { defineStore } from "pinia";
import type { ICarrierListResponse } from "@/types/carrier.types";

export type CarrierStoreState = {
  data: ICarrierListResponse[];
  carrier: ICarrierListResponse | null;
  isLoading: boolean;
  error: string | null;
};

export const useCarrierStore = defineStore({
  id: 'carrierStore',
  state: (): CarrierStoreState => ({
    data: [],
    carrier: null,
    isLoading: true,
    error: null,
  }),
  actions: {
    setCarriers(carriers: ICarrierListResponse[]): void {
      this.data = carriers;
    },
    setCarrier(carrier: ICarrierListResponse | null): void {
      this.carrier = carrier;
    },
    async fetchData(params: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        params = params ? `${params}&action=collect_carriers&token=${sessionStorage.sessionId}` 
                : `action=collect_carriers&token=${sessionStorage.sessionId}`;
        console.log('params', params);
        const carriers = await $fetch<ICarrierListResponse[]>(`/api/carrier?${params}`, { method: "GET" });
        this.setCarriers(carriers);
      } catch (error: any) {
        this.error = error.data.message || "An error occurred while fetching carriers";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  },
});