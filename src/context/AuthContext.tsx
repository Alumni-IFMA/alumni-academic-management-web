import { createContext, useContext, useState, type ReactNode } from "react";
import api from "../services/api";

interface AuthContextValue {
  isAuthenticated: boolean;
  userName: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

interface LoginResponseDto {
  token: string;
  name?: string;
  id?: number;
  userId?: number;
  user?: { id?: number };
}

export const AuthContext = createContext<AuthContextValue | null>(null);

function decodeJwtPayload(token: string): { name?: string } | null {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem("token"));
  const [userName, setUserName] = useState<string | null>(() => {
    const cachedToken = localStorage.getItem("token");
    const nameFromToken = cachedToken ? decodeJwtPayload(cachedToken)?.name : null;
    return nameFromToken ?? localStorage.getItem("userName");
  });

  async function login(email: string, password: string) {
    const { data } = await api.post<LoginResponseDto>("/auth/login", {
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

  async function fetchUserName(loginResponse: LoginResponseDto): Promise<string | null> {
    const userId = loginResponse.id ?? loginResponse.userId ?? loginResponse.user?.id;
    if (userId == null) return null;

    try {
      const { data: user } = await api.get<{ name?: string }>(`/auth/users/${userId}`);
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

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return context;
}
