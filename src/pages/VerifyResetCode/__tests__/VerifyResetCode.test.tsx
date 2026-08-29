import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { VerifyResetCode } from "../index";

vi.mock("../../../services/authService", () => ({
  verifyResetCode: vi.fn(),
  forgotPassword: vi.fn(),
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

import { verifyResetCode, forgotPassword } from "../../../services/authService";
import { toast } from "sonner";

const mockedVerifyResetCode = vi.mocked(verifyResetCode);
const mockedForgotPassword = vi.mocked(forgotPassword);

interface VerifyResetCodeState {
  email?: string;
}

function renderWithState(state: VerifyResetCodeState | undefined) {
  return render(
    <MemoryRouter initialEntries={[{ pathname: "/auth/reset-password/code", state }]}>
      <VerifyResetCode />
    </MemoryRouter>
  );
}

describe("VerifyResetCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("redireciona para /auth/forgot-password quando não há email no state", () => {
    renderWithState(undefined);

    expect(mockNavigate).toHaveBeenCalledWith("/auth/forgot-password", { replace: true });
    expect(toast.error).toHaveBeenCalledWith("Solicite um novo código antes de continuar.");
  });

  it("exibe erro de validação quando o código está vazio", async () => {
    renderWithState({ email: "user@test.com" });

    await userEvent.click(screen.getByRole("button", { name: /verificar/i }));

    expect(await screen.findByText("Código é obrigatório")).toBeInTheDocument();
  });

  it("chama verifyResetCode com o email do state e navega para reset-password com email e código", async () => {
    mockedVerifyResetCode.mockResolvedValue({ message: "ok" });
    renderWithState({ email: "user@test.com" });

    await userEvent.type(
      screen.getByPlaceholderText("Digite o código recebido por e-mail"),
      "123456"
    );
    await userEvent.click(screen.getByRole("button", { name: /verificar/i }));

    await waitFor(() => {
      expect(verifyResetCode).toHaveBeenCalledWith({ email: "user@test.com", code: "123456" });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/reset-password", {
        state: { email: "user@test.com", code: "123456" },
      });
    });
  });

  it("exibe toast de erro quando o código é inválido", async () => {
    mockedVerifyResetCode.mockRejectedValue({ response: { data: { message: "Código inválido" } } });
    renderWithState({ email: "user@test.com" });

    await userEvent.type(
      screen.getByPlaceholderText("Digite o código recebido por e-mail"),
      "000000"
    );
    await userEvent.click(screen.getByRole("button", { name: /verificar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Código inválido"));
  });

  it("botão Voltar navega para /auth/forgot-password sem enviar o formulário", async () => {
    renderWithState({ email: "user@test.com" });

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/auth/forgot-password");
    expect(verifyResetCode).not.toHaveBeenCalled();
  });

  it("desabilita o botão Verificar enquanto a requisição está em andamento", async () => {
    mockedVerifyResetCode.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    renderWithState({ email: "user@test.com" });

    await userEvent.type(
      screen.getByPlaceholderText("Digite o código recebido por e-mail"),
      "123456"
    );

    const botao = screen.getByRole("button", { name: /verificar/i });
    await userEvent.click(botao);

    expect(botao).toBeDisabled();
  });

  it("exibe o email mascarado", () => {
    renderWithState({ email: "abcdefgh1@gmail.com" });

    expect(screen.getByText(/a\*+1@gmail\.com/)).toBeInTheDocument();
  });

  it("botão Alterar navega para /auth/forgot-password", async () => {
    renderWithState({ email: "user@test.com" });

    await userEvent.click(screen.getByRole("button", { name: /alterar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/auth/forgot-password");
  });

  it("botão Reenviar o código chama forgotPassword com o email do state", async () => {
    mockedForgotPassword.mockResolvedValue({ message: "ok" });
    renderWithState({ email: "user@test.com" });

    await userEvent.click(screen.getByRole("button", { name: /reenviar o código/i }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith({ email: "user@test.com" });
      expect(toast.success).toHaveBeenCalledWith("Código reenviado!");
    });
  });
});
