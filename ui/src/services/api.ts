import axios from "axios";
import type { AxiosInstance, AxiosResponse } from "axios";
const backendUrl = import.meta.env.DEV
  ? "http://localhost:7000" // Dev backend
  : "https://api.example.com"; // Prod backend

const Api: AxiosInstance = axios.create({ baseURL: backendUrl + "/api/v1" });
Api.interceptors.response.use((res: AxiosResponse) => res.data);

export default Api;
