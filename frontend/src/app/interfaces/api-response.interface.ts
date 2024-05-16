export interface ApiResponse<TData = {}, TError = {}> {
  success: boolean;
  message: string;
  data?: TData;
  error?: TError;
}
