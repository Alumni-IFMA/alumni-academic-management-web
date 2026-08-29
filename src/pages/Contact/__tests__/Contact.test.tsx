import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Contact } from "../index";

vi.mock("../../../services/supportService", () => ({
  sendMessage: vi.fn(),
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
  Toaster: () => null,
}));

import { sendMessage } from "../../../services/supportService";
import { toast } from "sonner";

const mockedSendMessage = vi.mocked(sendMessage);

function renderPage() {
  return render(<Contact />);
}

describe("Contact", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe erros de validação quando os campos obrigatórios estão vazios", async () => {
    renderPage();

    await userEvent.click(screen.getByRole("button", { name: /enviar mensagem/i }));

    expect(await screen.findByText("Assunto é obrigatório")).toBeInTheDocument();
    expect(await screen.findByText("Mensagem é obrigatória")).toBeInTheDocument();
    expect(mockedSendMessage).not.toHaveBeenCalled();
  });

  it("envia a mensagem, exibe toast de sucesso e limpa o formulário", async () => {
    mockedSendMessage.mockResolvedValue({ id: 1 });
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Assunto"), "Dúvida sobre diploma");
    await userEvent.type(
      screen.getByPlaceholderText("Sua mensagem"),
      "Como solicito a segunda via?"
    );
    await userEvent.click(screen.getByRole("button", { name: /enviar mensagem/i }));

    await waitFor(() => {
      expect(mockedSendMessage).toHaveBeenCalledWith({
        subject: "Dúvida sobre diploma",
        message: "Como solicito a segunda via?",
      });
      expect(toast.success).toHaveBeenCalledWith("Mensagem enviada com sucesso!");
    });

    expect(screen.getByPlaceholderText("Assunto")).toHaveValue("");
    expect(screen.getByPlaceholderText("Sua mensagem")).toHaveValue("");
  });

  it("exibe toast de erro quando a API rejeita", async () => {
    mockedSendMessage.mockRejectedValue({ response: { data: { message: "Falha ao enviar" } } });
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Assunto"), "Assunto teste");
    await userEvent.type(screen.getByPlaceholderText("Sua mensagem"), "Mensagem teste");
    await userEvent.click(screen.getByRole("button", { name: /enviar mensagem/i }));

    await waitFor(() => expect(toast.error).toHaveBeenCalledWith("Falha ao enviar"));
  });

  it("desabilita o botão Enviar mensagem enquanto a requisição está em andamento", async () => {
    mockedSendMessage.mockImplementation(() => new Promise((resolve) => setTimeout(resolve, 100)));
    renderPage();

    await userEvent.type(screen.getByPlaceholderText("Assunto"), "Assunto teste");
    await userEvent.type(screen.getByPlaceholderText("Sua mensagem"), "Mensagem teste");

    const botao = screen.getByRole("button", { name: /enviar mensagem/i });
    await userEvent.click(botao);

    expect(botao).toBeDisabled();
  });
});
