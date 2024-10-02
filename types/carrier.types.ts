export interface ICarrier {
  id: number;
  tax_id: string;
  name: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_fax?: string;
  contact_mobile?: string;
  contact_title?: string;
  contact_department?: string;
  created_at?: Date;
  updated_at?: Date;
}

export interface ICarrierInput {
  tax_id: string;
  name: string;
  address?: string;
  address_2?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: string;
  contact_name?: string;
  contact_phone?: string;
  contact_email?: string;
  contact_fax?: string;
  contact_mobile?: string;
  contact_title?: string;
  contact_department?: string;
}

export interface ICarrierResponse {
  status: string;
  carrier: ICarrier;
  message: string;
}

export interface ICarrierListResponse {
  status: string;
  carriers: ICarrier[];
  message: string;
}