import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext";

vi.mock("../../services/api", () => ({
  default: { post: vi.fn() },
}));

import api from "../../services/api";

const mockedApi = api as Mocked<typeof api>;

function ConsumidorDeTeste() {
  const { isAuthenticated, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="status">{isAuthenticated ? "autenticado" : "visitante"}</span>
      <button onClick={() => login("u@test.com", "senha123")}>Entrar</button>
      <button onClick={logout}>Sair</button>
    </div>
  );
}

describe("AuthContext", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("isAuthenticated é false quando não há token no localStorage", () => {
    render(
      <AuthProvider>
        <ConsumidorDeTeste />
      </AuthProvider>
    );
    expect(screen.getByTestId("status").textContent).toBe("visitante");
  });

  it("isAuthenticated é true quando existe token no localStorage", () => {
    localStorage.setItem("token", "jwt-existente");
    render(
      <AuthProvider>
        <ConsumidorDeTeste />
      </AuthProvider>
    );
    expect(screen.getByTestId("status").textContent).toBe("autenticado");
  });

  it("login armazena o token e define isAuthenticated como true", async () => {
    mockedApi.post.mockResolvedValue({
      data: { token: "jwt-123" },
    });

    render(
      <AuthProvider>
        <ConsumidorDeTeste />
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Entrar"));
    });

    expect(localStorage.getItem("token")).toBe("jwt-123");
    expect(screen.getByTestId("status").textContent).toBe("autenticado");
  });

  it("login lança erro quando a API retorna falha", async () => {
    mockedApi.post.mockRejectedValue(new Error("Não autorizado"));

    let loginFn: ((email: string, password: string) => Promise<void>) | undefined;
    function Capturador() {
      loginFn = useAuth().login;
      return null;
    }

    render(
      <AuthProvider>
        <Capturador />
      </AuthProvider>
    );

    await expect(loginFn!("u@test.com", "senha123")).rejects.toThrow("Não autorizado");
  });

  it("logout limpa o token e define isAuthenticated como false", async () => {
    localStorage.setItem("token", "jwt-123");

    render(
      <AuthProvider>
        <ConsumidorDeTeste />
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Sair"));
    });

    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByTestId("status").textContent).toBe("visitante");
  });

  it("exposes userName decoded from JWT token", () => {
    // JWT with payload { name: "Kenia" } — encode manually:
    // header.payload.signature where payload = btoa(JSON.stringify({ name: "Kenia" }))
    const payload = btoa(JSON.stringify({ name: "Kenia" }));
    const fakeToken = `header.${payload}.signature`;
    localStorage.setItem("token", fakeToken);

    function Probe() {
      const { userName } = useAuth();
      return <span data-testid="name">{userName}</span>;
    }

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(screen.getByTestId("name")).toHaveTextContent("Kenia");
    localStorage.clear();
  });

  it("login extracts and persists userId from the login response", async () => {
    mockedApi.post.mockResolvedValue({ data: { token: "jwt-123", id: 42 } });

    function Probe() {
      const { userId } = useAuth();
      return <span data-testid="userId">{userId}</span>;
    }

    render(
      <AuthProvider>
        <ConsumidorDeTeste />
        <Probe />
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Entrar"));
    });

    expect(localStorage.getItem("userId")).toBe("42");
    expect(screen.getByTestId("userId").textContent).toBe("42");
  });

  it("userId stays null when the login response has no id", async () => {
    mockedApi.post.mockResolvedValue({ data: { token: "jwt-123" } });

    function Probe() {
      const { userId } = useAuth();
      return <span data-testid="userId">{userId ?? "null"}</span>;
    }

    render(
      <AuthProvider>
        <ConsumidorDeTeste />
        <Probe />
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Entrar"));
    });

    expect(screen.getByTestId("userId").textContent).toBe("null");
  });

  it("reads userId from localStorage on mount", () => {
    localStorage.setItem("userId", "7");

    function Probe() {
      const { userId } = useAuth();
      return <span data-testid="userId">{userId}</span>;
    }

    render(
      <AuthProvider>
        <Probe />
      </AuthProvider>
    );

    expect(screen.getByTestId("userId").textContent).toBe("7");
  });

  it("logout clears userId", async () => {
    localStorage.setItem("token", "jwt-123");
    localStorage.setItem("userId", "7");

    function Probe() {
      const { userId } = useAuth();
      return <span data-testid="userId">{userId ?? "null"}</span>;
    }

    render(
      <AuthProvider>
        <ConsumidorDeTeste />
        <Probe />
      </AuthProvider>
    );

    await act(async () => {
      await userEvent.click(screen.getByText("Sair"));
    });

    expect(localStorage.getItem("userId")).toBeNull();
    expect(screen.getByTestId("userId").textContent).toBe("null");
  });
});