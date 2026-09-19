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

// The deployed backend sleeps when idle and takes ~150s to start, so a request
// hanging for several seconds is expected rather than broken. Track in-flight
// requests and announce a slow spell so the UI can explain the wait.
// 4s is comfortably above normal round-trip latency but well short of the wake time.
const SLOW_REQUEST_MS = 4000;
let pending = 0;
let slowTimer = null;

const requestStarted = () => {
    pending += 1;
    if (slowTimer === null) {
        slowTimer = setTimeout(() => {
            window.dispatchEvent(new CustomEvent('api:slow'));
        }, SLOW_REQUEST_MS);
    }
};

const requestSettled = () => {
    pending = Math.max(0, pending - 1);
    if (pending === 0) {
        clearTimeout(slowTimer);
        slowTimer = null;
        window.dispatchEvent(new CustomEvent('api:settled'));
    }
};

// Add a request interceptor to include the token in headers
myAxios.interceptors.request.use((config) => {
    requestStarted();
    const token = getToken();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    requestSettled();
    return Promise.reject(error);
});

myAxios.interceptors.response.use((response) => {
    requestSettled();
    return response;
}, (error) => {
    requestSettled();
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