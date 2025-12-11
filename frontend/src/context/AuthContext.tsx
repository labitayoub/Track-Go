import { createContext, useContext, useState } from "react";
import { authAPI } from "../services/api";

// 1. Create Context
const AuthContext = createContext<any>(null);

// 2. Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user") || "null")
  );
  const [token, setToken] = useState(localStorage.getItem("token"));

  // --- Login ---
  const login = async (email: string, password: string) => {
    const res = await authAPI.login(email, password);

    const userData = res.data.user;
    const userToken = res.data.token;

    setUser(userData);
    setToken(userToken);

    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", userToken);
  };

  // --- Register ---
  const register = async (data: any) => {
    await authAPI.register(data);
  };

  // --- Logout ---
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  // isAuthenticated pour les routes
  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// 3. Custom Hook
export const useAuth = () => useContext(AuthContext);
