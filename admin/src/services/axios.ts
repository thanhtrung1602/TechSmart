import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BACKEND_URL,
  withCredentials: true,
});

let accessToken: string;

export const setAccessToken = (token: string) => {
  accessToken = token;
};
let refreshToken: string;

export const setRefreshToken = (token: string) => {
  refreshToken = token;
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
        const newAccessToken = await handleRefreshToken(refreshToken);
        if (newAccessToken) {
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${newAccessToken}`;
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
          return instance(originalRequest);
        }
      } catch (refreshError) {
        console.log(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const handleRefreshToken = async (refreshToken: string) => {
  console.log("test lấy refresh: ", refreshToken);
  const { data } = await instance.post("/auth/refresh", {
    refreshToken: refreshToken,
  });

  if (data) {
    setAccessToken(data.accessToken);
    return data.accessToken;
  }
};

export default instance;
