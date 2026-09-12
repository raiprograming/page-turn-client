// Shared, reusable API types used across services and interceptors.

export interface ApiSuccessResponse<T = unknown> {
  error: false;
  data: T;
}

export interface ApiErrorResponse {
  error: string;
}

export interface ApiResponse<T = unknown> {
  error: false | string;
  data: T;
}

// export type ApiResponse<T = unknown> = ApiSuccessResponse<T> | ApiErrorResponse;

// Normalized shape thrown by the response interceptor on failure,
// so callers never need to deal with raw Axios error internals.
export interface NormalizedApiError {
  message: string;
  statusCode?: number;
  errors?: unknown;
  isNetworkError: boolean;
}
