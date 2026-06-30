import { createContext, useCallback, useEffect, useState } from "react";
import { fetchMe } from "../api/authApi";
import { getToken, login as loginService, logout as logoutService, register as registerService } from "../services/authService";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function bootstrap() {
      const token = getToken();
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const { user: me } = await fetchMe();
        setUser(me);
      } catch {
        logoutService();
      } finally {
        setLoading(false);
      }
    }
    bootstrap();
  }, []);

  const login = useCallback(async (email, password) => {
    const u = await loginService(email, password);
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (name, email, password) => {
    const u = await registerService(name, email, password);
    setUser(u);
    return u;
  }, []);

  const logout = useCallback(() => {
    logoutService();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
