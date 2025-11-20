import axios from 'axios'
import { toast } from 'react-toastify';

const customaxios = axios.create({
  baseURL: import.meta.env.VITE_SERVER_URL,
  timeout: 1000,
  headers: {'X-Custom-Header': 'foobar', "Content-Type": "application/json"},
  credentials: "include", 
});


customaxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("googleid");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let isRetry = false;

customaxios.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !isRetry) {
      isRetry = true;

      try {
        await customaxios.get("/auth/refresh");

        isRetry = false;
        return customaxios(originalRequest); 
      } catch (refreshErr) {
        isRetry = false;
        toast.error("Session expired. Please login again");
        return Promise.reject(refreshErr);
      }
    }

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default customaxios

