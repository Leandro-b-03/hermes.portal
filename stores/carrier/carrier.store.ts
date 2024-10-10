import { defineStore } from "pinia";
import type { ICarrier, ICarrierListResponse } from "@/types/carrier.types";

export type CarrierStoreState = {
  data: ICarrierListResponse[];
  carrier: ICarrierListResponse | null;
  carrierList: any[];
  isLoading: boolean;
  error: string | null;
};

export const useCarrierStore = defineStore({
  id: 'carrierStore',
  state: (): CarrierStoreState => ({
    data: [],
    carrier: null,
    carrierList: [],
    isLoading: false,
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
        const carriers = await $fetch<ICarrierListResponse[]>(`/api/carrier?${params}`, { method: "GET" });
        this.setCarriers(carriers);
      } catch (error: any) {
        this.error = error.data.message || "An error occurred while fetching carriers";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async getCarrier(id: number): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        const carrier = await $fetch('/api/carrier/', { method: "GET", params: { action: 'collect_carrier', token: sessionStorage.sessionId, id: id } });
        this.setCarrier(carrier);
        return this.carrier;
      } catch (error: any) {
        this.error = error.data || "An error occurred while fetching carrier";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async getList(): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        const carrierList = await $fetch('/api/carrier/', { method: "GET", params: { action: 'collect_carrier', token: sessionStorage.sessionId, id: 'list' } });
        this.carrierList = carrierList;
        return this.carrierList;
      } catch (error: any) {
        this.error = error.data || "An error occurred while fetching carrier list";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async find(tax_id: string): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        const carrier = await $fetch<ICarrierListResponse>(`/api/carrier`, { method: "POST", body: { action: 'find', token: sessionStorage.sessionId, tax_id: tax_id } });
        this.setCarrier(carrier);
        return this.carrier;
      } catch (error: any) {
        this.error = error.data || "An error occurred while fetching carrier";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async createOrUpdate(carrier: ICarrier): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        let response;
        if (!carrier.id || carrier.id === "") {
          response = await $fetch<ICarrierListResponse>(`/api/carrier`, { method: "POST", body: { action: 'create', token: sessionStorage.sessionId, carrier: carrier } });
        } else {
          response = await $fetch<ICarrierListResponse>(`/api/carrier`, { method: "PUT", body: { action: 'update', token: sessionStorage.sessionId, carrier: carrier } });
        }

        return response;
      } catch (error: any) {
        if (carrier.id) {
          this.error = error.data || "An error occurred while creating carrier";
        } else {
          this.error = error.data || "An error occurred while updating carrier";
        }
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async delete(id: number): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        const response = await $fetch<ICarrierListResponse>(`/api/carrier`, { method: "DELETE", body: { action: 'delete', token: sessionStorage.sessionId, id: id } });
        console.log(this.data.data);
        this.data.data = this.data.data.filter((carrier) => carrier.id !== id);
        return true;
      } catch (error: any) {
        this.error = error.data || "An error occurred while deleting carrier";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async export(): Promise<any> {
      this.isLoading = true;
      this.error = null;
      try {
        const exportCarriers = await $fetch(`/api/carrier`, { method: "GET", params: { action: 'export', token: sessionStorage.sessionId } });
        return exportCarriers;
      } catch (error: any) {
        this.error = error.data || "An error occurred while exporting carriers";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    }
  },
});