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
    }, 600000); //600000 = 10 min
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
