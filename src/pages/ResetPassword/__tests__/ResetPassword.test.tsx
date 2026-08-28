import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ResetPassword } from "../index";

vi.mock("../../../services/authService", () => ({
  resetPassword: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  Toaster: () => null,
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

import { resetPassword } from "../../../services/authService";
import { toast } from "sonner";

const mockedResetPassword = vi.mocked(resetPassword);

interface ResetPasswordState {
  email?: string;
  code?: string;
}

function renderWithState(state: ResetPasswordState | undefined) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/auth/reset-password", state }]}>
      <ResetPassword />
    </MemoryRouter>
  );
}

describe("ResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redireciona para /auth/forgot-password quando não há email/código no state", () => {
    renderWithState(undefined);

    expect(mockNavigate).toHaveBeenCalledWith("/auth/forgot-password", { replace: true });
    expect(toast.error).toHaveBeenCalledWith("Solicite um novo código antes de continuar.");
  });

  it("exibe erro de validação quando a senha tem menos de 6 caracteres", async () => {
    renderWithState({ email: "user@test.com", code: "123456" });

    await userEvent.type(screen.getByPlaceholderText("Digite sua nova senha"), "123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(
      await screen.findByText("Senha deve ter pelo menos 6 caracteres")
    ).toBeInTheDocument();
  });

  it("exibe erro de validação quando as senhas não coincidem", async () => {
    renderWithState({ email: "user@test.com", code: "123456" });

    await userEvent.type(screen.getByPlaceholderText("Digite sua nova senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "outrasenha");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
  });

  it("chama resetPassword com o código do state como token e navega para /auth/login", async () => {
    mockedResetPassword.mockResolvedValue({ message: "ok" });
    renderWithState({ email: "user@test.com", code: "123456" });

    await userEvent.type(screen.getByPlaceholderText("Digite sua nova senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(resetPassword).toHaveBeenCalledWith({ token: "123456", newPassword: "senha123" });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("exibe toast de erro quando a API rejeita", async () => {
    mockedResetPassword.mockRejectedValue({ response: { data: { message: "Código expirado" } } });
    renderWithState({ email: "user@test.com", code: "123456" });

    await userEvent.type(screen.getByPlaceholderText("Digite sua nova senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Código expirado"));
  });

  it("botão Voltar navega para a tela de código levando o email no state", async () => {
    renderWithState({ email: "user@test.com", code: "123456" });

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/auth/reset-password/code", {
      state: { email: "user@test.com" },
    });
    expect(resetPassword).not.toHaveBeenCalled();
  });

  it("desabilita o botão Salvar enquanto a requisição está em andamento", async () => {
    mockedResetPassword.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    renderWithState({ email: "user@test.com", code: "123456" });

    await userEvent.type(screen.getByPlaceholderText("Digite sua nova senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");

    const botao = screen.getByRole("button", { name: /salvar/i });
    await userEvent.click(botao);

    expect(botao).toBeDisabled();
  });
});
