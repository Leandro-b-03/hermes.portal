export interface IRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  permissions?: string;
  default?: number;
  shipper_id?: number;
}

export interface IPermission {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
}

export interface IPermissionGroup {
  title: string;
  permissions: IPermission[];
}

export interface IRolesAndPermissionsResponse {
  roles: IRole[];
  permissions: {
    [key: string]: IPermissionGroup;
  };
}