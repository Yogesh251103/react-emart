import axios from "axios";
import { useRecoilState } from "recoil";
import { axiosAtom } from "../../atoms/sampleAtom";
import { useEffect } from "react";

const useAxios = () => {
  const [axiosState, setAxiosState] = useRecoilState(axiosAtom);

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

  const fetchData = async ({ url, method, data = {}, params = {} }) => {
    setAxiosState((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));

    controller.abort();
    controller = new AbortController();

    try {
      const result = await axiosInstance({
        url,
        method,
        data,
        params,
        signal: controller.signal,
      });
      setAxiosState((prev) => ({
        ...prev,
        response: result.data,
      }));

    } catch (err) {
      if (axios.isCancel(error)) {
        console.error("request has been cancelled ", err.message);
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
      error: "",
    }));
    }
  };
  const { response, error, loading } = axiosState;
  return { response, error, loading, fetchData };
};

export default useAxios;
