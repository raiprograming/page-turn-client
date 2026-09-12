import axios, { type AxiosInstance } from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS } from './config';
import { setupInterceptors } from './interceptors';

// Single Axios instance shared by every API service. Keeping instance
// creation here (instead of per-service `axios.create`) ensures base URL,
// timeouts, default headers, and interceptors stay consistent app-wide.
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT_MS,
  headers: {
    'Content-Type': 'application/json',
  },
});

setupInterceptors(apiClient);

export default apiClient;
