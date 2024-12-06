export interface IUser {
  id: string;
  name: string;
  email: string;
  password: string;
	user_info: [];
  roles: string[];
  shipper: [];
  createdAt: Date;
  updatedAt: Date;
}

export interface GenericResponse {
	status: string;
	message: string;
}

export interface ILoginInput {
	customer: {
		email: string;
		password: string;
	}
}

export interface ILoginResponse {
	status: string;
	access_token: string;
}

export interface ISignUpResponse {
	status: string;
	message: string;
}

export interface IUserListResponse {
	status: string;
	users: IUser[];
	message: string;
}