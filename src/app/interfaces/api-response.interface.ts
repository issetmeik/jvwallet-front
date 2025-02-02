export interface ApiResponse<T> {
  data: T;
  error: string | null;
  statusCode: number;
}
