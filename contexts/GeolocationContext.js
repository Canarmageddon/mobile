import React, { useContext, useState, useEffect } from "react";
const PositionContext = React.createContext();
export function usePosition() {
  return useContext(PositionContext);
}
export function PositionProvider({ children }) {
  const getPosition = () => {
    navigator.geolocation.getCurrentPosition((position) => {
      setPosition({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
      });
    });
  };
  useEffect(() => {
    getPosition();
    const interval = setInterval(() => {
      getPosition();
    }, 60000000000000000000);
    return () => {
      clearInterval(interval);
    };
  }, []);
  const [position, setPosition] = useState(null);
  return (
    <PositionContext.Provider value={[position, setPosition]}>
      {children}
    </PositionContext.Provider>
  );
}