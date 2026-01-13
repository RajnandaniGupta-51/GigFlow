import { createContext, useContext, useEffect } from "react";
import { socket } from "../socket";

const SocketContext = createContext();

export const SocketProvider = ({ children, userId }) => {
  useEffect(() => {
    if (userId) socket.emit("join", userId);
  }, [userId]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
