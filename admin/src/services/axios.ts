import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  withCredentials: true,
});

let accessToken: string;

export const setAccessToken = (token: string) => {
  accessToken = token;
};

instance.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 403 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        instance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
