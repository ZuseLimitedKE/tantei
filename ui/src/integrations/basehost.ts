const devUrl = import.meta.env.VITE_DEV_BACKEND_URL;
const prodUrl = import.meta.env.VITE_PROD_BACKEND_URL;

export const BASEHOST = import.meta.env.DEV
  ? devUrl // Dev backend
  : prodUrl; // Prod backend
