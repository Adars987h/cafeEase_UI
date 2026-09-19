import axios from 'axios';
import { getToken } from './user_service'; // Import the getToken function
import { useState, useEffect } from 'react';

// Set REACT_APP_API_BASE_URL in Vercel (Project Settings > Environment Variables).
// Falls back to the local backend so `npm start` works with no setup.
// Note: CRA inlines env vars at BUILD time - changing it in Vercel needs a redeploy.
export const BASE_URL =
    process.env.REACT_APP_API_BASE_URL || "http://localhost:8081";

export const myAxios = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to include the token in headers
myAxios.interceptors.request.use((config) => {
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;