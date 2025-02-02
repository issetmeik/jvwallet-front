import { ApiResponse } from './api-response.interface';

export interface Token {
  accessToken: string;
}

export type TokenResponse = ApiResponse<Token>;
