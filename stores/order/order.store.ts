import { defineStore } from "pinia";
import type { IOrder, IOrderFreight, IOrderResponse } from "@/types/order.types";

export type OrderStoreState = {
  data: IOrderResponse | null;
  order: IOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const useOrderStore = defineStore({
  id: "orderStore",
    state: (): OrderStoreState => ({
      data: null,
      order: null,
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
          const orders = await $fetch<IOrderResponse>(
            `/api/order?${params}`,
            { method: "GET" }
          );
          console.log(orders);
          this.setOrders(orders);
        } catch (error: any) {
          this.error =
            error.data.message || "An error occurred while fetching orders";
          return Promise.reject(this.error);
        } finally {
          this.isLoading = false;
        }
      }
    }
});