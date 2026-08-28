import { describe, it, expect, beforeEach, vi, type Mocked } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import type { ReactNode } from "react";
import { LoginForm } from "../LoginForm";
import { AuthProvider } from "../../../context/AuthContext";

vi.mock("../../../services/api", () => ({
  default: { post: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
  Toaster: () => null,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

import api from "../../../services/api";
import { toast } from "sonner";

const mockedApi = api as Mocked<typeof api>;

function Wrapper({ children }: { children: ReactNode }) {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
}

describe("LoginForm", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("exibe erro de validação para email com formato inválido", async () => {
    render(<LoginForm />, { wrapper: Wrapper });

    await userEvent.type(screen.getByPlaceholderText("Digite seu email"), "naoemail");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
  });

  it("exibe erro de validação quando a senha tem menos de 6 caracteres", async () => {
    render(<LoginForm />, { wrapper: Wrapper });

    await userEvent.type(screen.getByPlaceholderText("Digite seu email"), "valido@email.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    expect(
      await screen.findByText("Senha deve ter pelo menos 6 caracteres")
    ).toBeInTheDocument();
  });

  it("chama login e navega para /home em caso de sucesso", async () => {
    mockedApi.post.mockResolvedValue({ data: { token: "jwt-123" } });

    render(<LoginForm />, { wrapper: Wrapper });

    await userEvent.type(screen.getByPlaceholderText("Digite seu email"), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith("/home"));
  });

  it("exibe toast de erro quando as credenciais são inválidas", async () => {
    mockedApi.post.mockRejectedValue(new Error("Não autorizado"));

    render(<LoginForm />, { wrapper: Wrapper });

    await userEvent.type(screen.getByPlaceholderText("Digite seu email"), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senhaerrada");
    await userEvent.click(screen.getByRole("button", { name: /entrar/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("Email ou senha inválidos.")
    );
  });

  it("desabilita o botão de submit enquanto a requisição está em andamento", async () => {
    mockedApi.post.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );

    render(<LoginForm />, { wrapper: Wrapper });

    await userEvent.type(screen.getByPlaceholderText("Digite seu email"), "usuario@test.com");
    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");

    const botao = screen.getByRole("button", { name: /entrar/i });
    await userEvent.click(botao);

    expect(botao).toBeDisabled();
  });
});