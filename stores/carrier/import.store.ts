import { defineStore } from "pinia";

export type ImportStoreState = {
  data: any[];
  carrierImport: any;
  isLoading: boolean;
  error: string | null;
};

export const useImportStore = defineStore({
  id: 'importStore',
  state: (): ImportStoreState => ({
    data: [],
    carrierImport: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    setimports(data: any[]): void {
      this.data = data;
    },
    setImport(carrierImport: any): void {
      this.carrierImport = carrierImport;
    },
    async fetchData(params: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        params = params ? `${params}&action=import_list&token=${localStorage.sessionId}` 
                : `action=import_list&token=${localStorage.sessionId}`;
                console.log(params);
        const data = await $fetch<any[]>(`/api/carrier?${params}`, { method: "GET" });
        this.setimports(data);
      } catch (error: any) {
        this.error = error.data.message || "An error occurred while fetching carrier imports";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchDataById(id: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        const carrierImport = await $fetch<any>(`/api/carrier?id=${id}&action=import_list&token=${localStorage.sessionId}`, { method: "GET" });
        this.setImport(carrierImport);
      } catch (error: any) {
        this.error = error.data.message || "An error occurred while fetching carrier import";
        this.setImport(null);
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
    async scheduleImport(data: FormData): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        data.append('token', localStorage.sessionId);
        data.append('action', 'import_csv');
        await $fetch<any>('/api/carrier', { method: "POST", body: data });
      } catch (error: any) {
        this.error = error.data.message || "An error occurred while scheduling carrier import";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    }
  }
});