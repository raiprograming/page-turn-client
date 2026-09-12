import type { AxiosInstance } from 'axios';

// Centralized interceptor registration point.
// Add request/response interceptor logic here later; this keeps a single
// place to wire them onto any Axios instance instead of scattering
// `instance.interceptors.*.use(...)` calls across the codebase.
export const setupInterceptors = (instance: AxiosInstance): AxiosInstance => {
  instance.interceptors.request.use(
    (config) => config,
    (error) => Promise.reject(error),
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => Promise.reject(error),
  );

  return instance;
};
