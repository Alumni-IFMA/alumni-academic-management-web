import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { SetPassword } from "../index";

vi.mock("../../../services/authService", () => ({
  setPassword: vi.fn(),
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

import { setPassword } from "../../../services/authService";
import { toast } from "sonner";

const mockedSetPassword = vi.mocked(setPassword);

function renderPage(initialEntry = "/auth/set-password?token=abc123") {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <SetPassword />
    </MemoryRouter>
  );
}

describe("SetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe erro de validação quando a senha tem menos de 6 caracteres", async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(
      await screen.findByText("Senha deve ter pelo menos 6 caracteres")
    ).toBeInTheDocument();
  });

  it("exibe erro de validação quando as senhas não coincidem", async () => {
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "outrasenha");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    expect(await screen.findByText("As senhas não coincidem")).toBeInTheDocument();
  });

  it("chama setPassword com o token da URL e navega para /auth/login em caso de sucesso", async () => {
    mockedSetPassword.mockResolvedValue({ message: "ok" });
    renderPage("/auth/set-password?token=abc123");

    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(setPassword).toHaveBeenCalledWith({ token: "abc123", newPassword: "senha123" });
      expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    });
  });

  it("exibe toast de erro quando a API rejeita (token inválido/expirado)", async () => {
    mockedSetPassword.mockRejectedValue({ response: { data: { message: "Token expirado" } } });
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Token expirado"));
  });

  it("exibe erro e não chama a API quando não há token na URL", async () => {
    renderPage("/auth/set-password");

    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");
    await userEvent.click(screen.getByRole("button", { name: /salvar/i }));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        "Link inválido ou expirado. Solicite um novo e-mail."
      );
    });
    expect(setPassword).not.toHaveBeenCalled();
  });

  it("botão Voltar navega para /auth/login sem enviar o formulário", async () => {
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/auth/login");
    expect(setPassword).not.toHaveBeenCalled();
  });

  it("desabilita o botão Salvar enquanto a requisição está em andamento", async () => {
    mockedSetPassword.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Digite sua senha"), "senha123");
    await userEvent.type(screen.getByPlaceholderText("Digite a senha novamente"), "senha123");

    const botao = screen.getByRole("button", { name: /salvar/i });
    await userEvent.click(botao);

    expect(botao).toBeDisabled();
  });
});
