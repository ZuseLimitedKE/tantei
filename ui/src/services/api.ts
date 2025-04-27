import axios from "axios";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
const devUrl = import.meta.env.VITE_DEV_BACKEND_URL;
const prodUrl = import.meta.env.VITE_PROD_BACKEND_URL;
const backendUrl = import.meta.env.DEV
  ? devUrl // Dev backend
  : prodUrl; // Prod backend

const Api: AxiosInstance = axios.create({ baseURL: backendUrl + "/api/v1" });
Api.interceptors.response.use(
  (res: AxiosResponse) => res.data,
  (err: AxiosError) => {
    console.error(err);
  },
);

export default Api;
