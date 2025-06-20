import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
const useAxios = () => {
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [controller, setController] = useState(null);
  const axiosInstance = useRef(
    axios.create({
        baseURL: process.env.API_BASE_URL,
        timeout: 10000,
        headers: {
            'Content-Type' : 'application/json',

        }
    })
  )
  axiosInstance.current.interceptors.response.use(
  (response)=>{
    return response;
  },
  (error)=>{
    return Promise.reject(error)
  }
  );
  const fetchData = useCallback(async (config)=> {
    try {
        setLoading(true);
        setError(null);
        const ctrl = new AbortController();
        setController(ctrl)
        const {data} = await axiosInstance.current({
            ...config,
            signal: ctrl.signal
        })
        setResponse(data);
        return data
    } catch (err){
        if (!axios.isCancel(err)){
            setError(err.response?.data?.message || err.message || "Something went wrong!"
            )
        }
        throw err;
    
    } finally {
        setLoading(false)
    }
  }, [])
};
