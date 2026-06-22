import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AuthProvider, useAuth } from "../AuthContext";

vi.mock("../../services/api", () => ({
  default: { post: vi.fn() },
}));

import api from "../../services/api";

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
    api.post.mockResolvedValue({
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
    api.post.mockRejectedValue(new Error("Não autorizado"));

    let loginFn;
    function Capturador() {
      loginFn = useAuth().login;
      return null;
    }

    render(
      <AuthProvider>
        <Capturador />
      </AuthProvider>
    );

    await expect(loginFn("u@test.com", "senha123")).rejects.toThrow("Não autorizado");
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
});