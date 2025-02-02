import { ApiResponse } from './api-response.interface';

export interface User {
  id: string;
  login: string;
  password: string;
  createdAt: string;
}

export type UserResponse = ApiResponse<User>;
