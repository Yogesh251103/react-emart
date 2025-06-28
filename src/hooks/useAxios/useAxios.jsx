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
    role = "vendor", // "admin" or "vendor"
    retry = true,
  }) => {
    setAxiosState((prev) => ({ ...prev, loading: true }));

    controller.abort();
    controller = new AbortController();

    const tokenKey = role === "admin" ? "adminToken" : "vendorToken";
    const token = localStorage.getItem(tokenKey);
    const refreshToken = localStorage.getItem("refreshToken");

    const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        headers: {
          ...authHeader,
          ...headers,
        },
        signal: controller.signal,
      });

      setAxiosState((prev) => ({
        ...prev,
        response: result.data,
        error: "",
      }));

      return result.data;
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message;
      console.log(err)
      if (
        status === 401 &&
        message !== "Invalid Credentials" &&
        retry &&
        !url.includes("/auth/refresh-token")
      ) {
        // attempt token refresh
        try {
          const refreshResult = await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/auth/refresh-token`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          const newAccessToken = refreshResult.data.accessToken;
          if (newAccessToken) {
            localStorage.setItem(tokenKey, newAccessToken);

            // Retry original request with new token
            return fetchData({
              url,
              method,
              data,
              params,
              headers,
              role,
              retry: false, // avoid infinite loop
            });
          }
        } catch (refreshErr) {
          // refresh token failed
          localStorage.removeItem("adminToken");
          localStorage.removeItem("vendorToken");
          localStorage.removeItem("refreshToken");
          window.location.href = "/login";
          return;
        }
      }

      if (!axios.isCancel(err)) {
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
