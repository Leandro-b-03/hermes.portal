export interface IOrder {
  id: number;
  quote_id: string;
  shipper_id: number;
  is_partner_order: boolean;
  business_unit: string;
  service_type: string;
  order_type: string;
  freight_payment_type: string;
  shipping_provider: string;
  handling_time_business_days: number;
  extra_delivery_time_business_days: number;
  preferred_index: string;
  client_type: string;
  cumulative_rules: boolean;
  rule_tags: any;
  sales_channel: string;
  session: string;
  order_id: string;
  ip: string;
  page_name: string;
  url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface IOrderFreight {
  id: number;
  order_id: number;
  mode: string;
  origin_code: string;
  destination_code: string;
  carrier_id: number;
  product_id: number;
  weight: number;
  quantity: number;
  cubic_meters: number;
  cubic_weight: number;
  freight_cost_value?: number;
  freight_cost_advalorem?: number;
  freight_cost_gris?: number;
  freight_cost_icms?: number;
  freight_cost_iss?: number;
  freight_cost_price_per_exceeded_weight?: number;
  freight_cost_price_weight_fee: number;
  carrier_shipping_days: number;
  carrier_shipping_date: string;
  freight_customer_cost_value?: number;
  freight_customer_cost_detail?: any;
  customer_shipping_days: number;
  customer_shipping_date: string;
  created_at?: string;
  updated_at?: string;
}

export interface IOrderResponse {
  success: boolean;
  data: {
    orders: {
      current_page: number;
      data: IOrder[];
      first_page_url: string;
      from: number;
      last_page: number;
      last_page_url: string;
      links: {
        url: string | null;
        label: string;
        active: boolean;
      }[];
      next_page_url: string | null;
      path: string;
      per_page: number;
      prev_page_url: string | null;
      to: number;
      total: number;
    };
  };
  message: string;
}