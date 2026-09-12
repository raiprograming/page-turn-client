// Centralized runtime configuration for the API layer.
// Values are sourced from the root `.env` file via Vite's `import.meta.env`.
// Only variables prefixed with `VITE_` are exposed to client-side code.

export const API_BASE_URL = import.meta.env.VITE_SERVER_URL;

export const API_TIMEOUT_MS = 60000;
