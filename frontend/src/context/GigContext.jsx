import { createContext, useContext, useEffect, useState } from "react";
import api from "../api/axios";

const GigContext = createContext();

export const GigProvider = ({ children }) => {
  const [gigs, setGigs] = useState([]);

  const fetchGigs = async () => {
    const res = await api.get("/gigs");
    setGigs(res.data);
  };

  useEffect(() => {
    fetchGigs();
  }, []);

  return (
    <GigContext.Provider value={{ gigs }}>
      {children}
    </GigContext.Provider>
  );
};

export const useGigs = () => useContext(GigContext);
