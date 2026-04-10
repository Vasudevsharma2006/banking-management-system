import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../api/api";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    localStorage.setItem("token", data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  const refreshProfile = async () => {
    const { data } = await api.get("/auth/me");
    setUser(data.user);
  };

  const toggleTheme = () => {
    const next = theme === "light" ? "dark" : "light";
    setTheme(next);
    localStorage.setItem("theme", next);
  };

  useEffect(() => {
    // Keep theme state synced with the root element for CSS variable switching.
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  useEffect(() => {
    const bootstrapAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        await refreshProfile();
      } catch (error) {
        localStorage.removeItem("token");
      } finally {
        setLoading(false);
      }
    };
    bootstrapAuth();
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout, refreshProfile, theme, toggleTheme }),
    [user, loading, theme]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
