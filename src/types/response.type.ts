import { User } from "./user.type";

export interface ResponseSuccessful<TData> {
  message: string
  // data: TData
  status: number;
  access_token: string;
  userInfo: User;

  
}

export interface LoginResponse {
  access_token: string
  userInfo: User;
}
