import axios from "axios";

export const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(
  (config) => {
    const auth = localStorage.getItem("auth");
    if (auth) {
      const { token } = JSON.parse(auth);
      if (token && config.headers) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError: { message: string; statusCode: number } = {
      message: error.response?.data?.message || "Une erreur est survenue",
      statusCode: error.response?.status || 500,
    };

    return Promise.reject(customError);
  }
);
