import { defineStore } from "pinia";
import type { IOrder, IOrderFreight, IOrderResponse } from "@/types/order.types";
import type { ICarrierResponse } from "@/types/carrier.types";

export type OrderStoreState = {
  data: IOrderResponse | null;
  order: IOrder | null;
  carriers: ICarrierResponse[] | null;
  isLoading: boolean;
  error: string | null;
};

export const useOrderStore = defineStore({
  id: "orderStore",
    state: (): OrderStoreState => ({
      data: null,
      order: null,
      carriers: null,
      isLoading: false,
      error: null,
    }),
    actions: {
      setOrder (order: IOrder | null): void {
        this.order = order;
      },
      setOrders (orders: IOrderResponse | null): void {
        this.data = orders;
      },
      setCarriers (carriers: ICarrierResponse[] | null): void {
        this.carriers = carriers;
      },
      setIsloading (isLoading: boolean): void {
        this.isLoading = isLoading;
      },
      async fetchData (params: string): Promise<void> {
        console.log(params, this.isLoading, this.error);
        this.setIsloading(true);
        this.error = null;
        try {
          params = params
            ? `${params}&action=get_orders&token=${localStorage.sessionId}`
            : `action=get_orders&token=${localStorage.sessionId}`;
          const data = await $fetch<IOrderResponse>(
            `/api/order?${params}`,
            { method: "GET" }
          );
          console.log(data);
          this.setOrders(data.orders);
          this.fetchCarriers(data.carriers_ids);
        } catch (error: any) {
          this.error =
            error.data.message || "An error occurred while fetching orders";
          return Promise.reject(this.error);
        } finally {
          this.isLoading = false;
        }
      },
      async fetchCarriers(ids: number[]): Promise<void> {
        const carrierStore = useCarrierStore();
        this.isLoading = true;
        this.error = null;

        console.log(ids);
        await carrierStore.fetchData(`id=${ids.join(',')}&fields=id&order=true`, true);
        this.setCarriers(carrierStore.dataForOtherStores);
      },
    }
});