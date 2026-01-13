// src/socket.js (frontend)
import { io } from "socket.io-client";

// export the socket so other files can use it
export const socket = io("http://localhost:5000", {
  withCredentials: true,
  autoConnect: false,
});

socket.on("connect", () => {
  console.log("Connected to Socket.IO server", socket.id);
});
