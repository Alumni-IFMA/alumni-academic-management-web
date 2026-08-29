import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { ForgotPassword } from "../index";

vi.mock("../../../services/authService", () => ({
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

import { forgotPassword } from "../../../services/authService";
import { toast } from "sonner";

const mockedForgotPassword = vi.mocked(forgotPassword);

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/auth/forgot-password"]}>
      <ForgotPassword />
    </MemoryRouter>
  );
}

describe("ForgotPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe erro de validação para email com formato inválido", async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Digite seu email cadastrado"), "naoemail");
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
  });

  it("chama forgotPassword e navega para a tela de código com o email no state", async () => {
    mockedForgotPassword.mockResolvedValue({ message: "ok" });
    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText("Digite seu email cadastrado"),
      "user@test.com"
    );
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => {
      expect(forgotPassword).toHaveBeenCalledWith({ email: "user@test.com" });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/reset-password/code", {
        state: { email: "user@test.com" },
      });
    });
  });

  it("exibe toast de erro quando a API rejeita", async () => {
    mockedForgotPassword.mockRejectedValue({ response: { data: { message: "Email não encontrado" } } });
    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText("Digite seu email cadastrado"),
      "user@test.com"
    );
    await userEvent.click(screen.getByRole("button", { name: /enviar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Email não encontrado"));
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it("botão Voltar navega para /auth/login sem enviar o formulário", async () => {
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    expect(forgotPassword).not.toHaveBeenCalled();
  });

  it("desabilita o botão Enviar enquanto a requisição está em andamento", async () => {
    mockedForgotPassword.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    renderPage();

    await userEvent.type(
      screen.getByPlaceholderText("Digite seu email cadastrado"),
      "user@test.com"
    );

    const botao = screen.getByRole("button", { name: /enviar/i });
    await userEvent.click(botao);

    expect(botao).toBeDisabled();
  });
});
