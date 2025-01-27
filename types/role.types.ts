export interface IRole {
  id: number;
  name: string;
  guard_name: string;
  created_at: string;
  updated_at: string;
  description?: string;
  formatted_permissions: {
    [key: string]: { // Using an index signature for dynamic keys like "auth", "order", etc.
      [permissionName: string]: boolean; // Permission name (e.g., "25-auth.create") and its value (true/false)
    };
  };
  permissions?: object;
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

export interface IModules {
  title: string;
  permissions: IPermission[];
}

export interface IRolesAndPermissionsResponse {
  roles: IRole[];
  permissions: {
    [key: string]: IModules;
  };
}