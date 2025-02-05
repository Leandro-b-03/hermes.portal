export interface IShipper {
  id: number;
  tax_id: string;
  name: string;
  address: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  zip_code: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  contact_document?: string;
  logo_image_url?: string;
  shipper_matrix_id?: number;
  modules: string[];
  created_at?: Date;
  updated_at?: Date;
}

export interface GenericResponse {
  status: string;
  message: string;
}

export interface ICreateShipperInput {
  tax_id: string;
  name: string;
  address: string;
  address_2: string;
  city: string;
  state: string;
  country: string;
  zip_code: number;
  contact_name: string;
  contact_email: string;
  contact_phone?: string;
  contact_document?: string;
  logo_image_url?: string;
  shipper_matrix_id?: number;
}

export interface ICreateShipperResponse {
  status: string;
  message: string;
  shipper: IShipper;
}