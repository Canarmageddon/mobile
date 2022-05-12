import React, { useState, useContext } from "react";

const UserContext = React.createContext();
const UserUpdateContext = React.createContext();

export function useUser() {
  return useContext(UserContext);
}
export function useUserUpdate() {
  return useContext(UserUpdateContext);
}
export function useToken() {
  return useContext(UserContext);
}
export function useTokenUpdate() {
  return useContext(UserUpdateContext);
}
export function UserProvider({ children }) {
  const [user, setUser] = useState([]);
  const [token, setToken] = useState("");
  const changeUser = (user) => {
    setUser(user);
  };
  const changeToken = (token) => {
    setToken(token);
  };
  return (
    <UserContext.Provider value={[user, token]}>
      <UserUpdateContext.Provider value={[changeUser, changeToken]}>
        {children}
      </UserUpdateContext.Provider>
    </UserContext.Provider>
  );
}
