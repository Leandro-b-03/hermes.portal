import { defineStore } from "pinia";

export type ImportStoreState = {
  data: any[];
  carrierImports: any;
  isLoading: boolean;
  error: string | null;
};

export const useImportStore = defineStore({
  id: 'importStore',
  state: (): ImportStoreState => ({
    data: [],
    carrierImports: null,
    isLoading: false,
    error: null,
  }),
  actions: {
    setimports(data: any[]): void {
      this.data = data;
    },
    setImport(carrierImports: any): void {
      this.carrierImports = carrierImports;
    },
    async fetchData(params: string): Promise<void> {
      this.isLoading = true;
      this.error = null;
      try {
        params = params ? `${params}&action=import_list&token=${sessionStorage.sessionId}` 
                : `action=import_list&token=${sessionStorage.sessionId}`;
        const carrierImports = await $fetch<any[]>(`/api/carrier?${params}`, { method: "GET" });
        this.setimports(carrierImports);
      } catch (error: any) {
        this.error = error.data.message || "An error occurred while fetching carrier imports";
        return Promise.reject(this.error);
      } finally {
        this.isLoading = false;
      }
    },
  }
});