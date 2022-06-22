import React, { useState, useContext } from "react";

const TripContext = React.createContext();
const TripUpdateContext = React.createContext();

export function useTrip() {
  return useContext(TripContext);
}
export function useTripUpdate() {
  return useContext(TripUpdateContext);
}
export function TripProvider({ children }) {
  const [trip, setTrip] = useState([]);
  const changeTrip = (trip) => {
    setTrip(trip);
  };
  return (
    <TripContext.Provider value={trip}>
      <TripUpdateContext.Provider value={changeTrip}>
        {children}
      </TripUpdateContext.Provider>
    </TripContext.Provider>
  );
}
