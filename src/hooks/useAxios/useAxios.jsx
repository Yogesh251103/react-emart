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
        console.log(err)
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
