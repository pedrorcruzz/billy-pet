import React, { createContext, useCallback, useContext, useState } from "react";

/** Credenciais mock: pedro@gmail.com ou pedro + Pedro1@ */
const MOCK_CREDENTIALS = {
  email: "pedro@gmail.com",
  user: "pedro",
  password: "Pedro1@",
};

interface AuthContextValue {
  isAuthenticated: boolean;
  login: (emailOrUser: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = useCallback((emailOrUser: string, password: string) => {
    const normalized = emailOrUser.trim().toLowerCase();
    const isValid =
      (normalized === MOCK_CREDENTIALS.email || normalized === MOCK_CREDENTIALS.user) &&
      password === MOCK_CREDENTIALS.password;

    if (isValid) {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
