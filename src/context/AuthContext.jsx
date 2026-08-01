import { createContext, useContext, useState } from "react";
import api from "../services/api";

export const AuthContext = createContext(null);

function decodeJwtPayload(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [userName, setUserName] = useState(() => {
    const cachedToken = localStorage.getItem("token");
    const nameFromToken = cachedToken ? decodeJwtPayload(cachedToken)?.name : null;
    return nameFromToken ?? localStorage.getItem("userName");
  });

  async function login(email, password) {
    const { data } = await api.post("/auth/login", {
      email: email.trim(),
      password: password.trim(),
    });
    localStorage.setItem("token", data.token);
    setToken(data.token);

    const name = decodeJwtPayload(data.token)?.name ?? data.name ?? (await fetchUserName(data));
    if (name) {
      localStorage.setItem("userName", name);
      setUserName(name);
    }
  }

  async function fetchUserName(loginResponse) {
    const userId = loginResponse.id ?? loginResponse.userId ?? loginResponse.user?.id;
    if (userId == null) return null;

    try {
      const { data: user } = await api.get(`/auth/users/${userId}`);
      return user?.name ?? null;
    } catch {
      return null;
    }
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    setToken(null);
    setUserName(null);
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!token,
        userName: token ? (userName ?? "Usuário") : null,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
