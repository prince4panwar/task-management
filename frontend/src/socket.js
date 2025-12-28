import { io } from "socket.io-client";

const SOCKET_URL =
  window.location.hostname === "localhost"
    ? import.meta.env.VITE_API_LOCAL_URL
    : import.meta.env.VITE_API_URL;

export const socket = io(SOCKET_URL);
