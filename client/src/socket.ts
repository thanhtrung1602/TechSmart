import { io } from "socket.io-client";

// Ensure URL is set correctly
const URL = import.meta.env.VITE_API_BACKEND_URL || "http://localhost:3000";

export const socket = io(URL, {
    transports: ["websocket"],  // Enforces WebSocket transport for better stability in some cases
    autoConnect: true,          // Ensures auto-connection
    reconnection: true,         // Enables reconnection in case of connection loss
});
