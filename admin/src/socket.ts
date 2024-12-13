import { io } from "socket.io-client";

// Ensure URL is set correctly
const URL = import.meta.env.VITE_API_BACKEND_URL || "http://localhost:3000";

export const socket = io(URL, {
    transports: ["websocket"],
    autoConnect: true,
    reconnection: true,
});
