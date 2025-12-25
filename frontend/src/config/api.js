export const BASE_URL =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_API_LOCAL_URL
    : import.meta.env.VITE_API_URL;
