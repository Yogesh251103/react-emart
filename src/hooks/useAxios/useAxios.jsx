import axios from "axios";
import { useEffect, useState } from "react";

const useAxios = () => {
  const [axiosState, setAxiosState] = useState({
    response: null,
    error: "",
    loading: false,
  });

  const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_APP_API_URL,
  });

  axiosInstance.interceptors.request.use(
    (config) => {
      const isAdmin = config.url.includes("/admin");
      const token = localStorage.getItem(isAdmin ? "adminToken" : "vendorToken");
      if (token){
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh-token")
    ) {
      originalRequest._retry = true;
      const isAdmin = originalRequest.url.includes("/admin");
      const refreshUrl = `${import.meta.env.VITE_APP_API_URL}/auth/refresh-token`;
      const tokenKey = isAdmin ? "adminToken" : "vendorToken";

      try {
        const refreshResponse = await axios.post(refreshUrl);
        const newAccessToken = refreshResponse.data.accessToken;

        if (newAccessToken) {
          localStorage.setItem(tokenKey, newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        localStorage.removeItem("adminToken");
        localStorage.removeItem("vendorToken");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error); 
  }
);


  let controller = new AbortController();

  useEffect(() => {
    return () => {
      controller?.abort();
    };
  }, []);

  const fetchData = async ({
    url,
    method,
    data = {},
    params = {},
    headers = {},
  }) => {
    console.log(headers);
    setAxiosState((prev) => {
      return {
        ...prev,
        loading: true,
      };
    });
    controller.abort();
    controller = new AbortController();

    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers,
        signal: controller.signal,
      });
      setAxiosState((prev) => {
        return {
          ...prev,
          response: result.data,
          error: "",
        };
      });
      return result.data;
    } catch (err) {
      if (axios.isCancel(err)) {
        console.error("Request has been cancelled ", err.message);
      } else {
        setAxiosState((prev) => ({
          ...prev,
          error: err.response ? err.response.data : err.message,
        }));
      }
    } finally {
      setAxiosState((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  const { response, error, loading } = axiosState;
  return { response, error, loading, fetchData };
};

export default useAxios;
