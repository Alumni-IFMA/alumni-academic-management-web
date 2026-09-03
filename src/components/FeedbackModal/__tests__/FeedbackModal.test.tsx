import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, type Mocked } from "vitest";
import { FeedbackModal } from "../FeedbackModal";
import * as supportService from "../../../services/supportService";

vi.mock("../../../services/supportService");
vi.mock("sonner", () => ({ toast: { success: vi.fn(), error: vi.fn() } }));

const mockedSupportService = supportService as Mocked<typeof supportService>;

describe("FeedbackModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<FeedbackModal isOpen={false} onClose={vi.fn()} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("shows validation errors when submitted empty", async () => {
    render(<FeedbackModal isOpen onClose={vi.fn()} />);

    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    expect(await screen.findByText("Assunto é obrigatório")).toBeInTheDocument();
    expect(screen.getByText("Mensagem é obrigatória")).toBeInTheDocument();
  });

  it("sends the message and closes on success", async () => {
    mockedSupportService.sendMessage.mockResolvedValue({});
    const onClose = vi.fn();
    render(<FeedbackModal isOpen onClose={onClose} />);

    await userEvent.type(screen.getByPlaceholderText("Assunto"), "Sugestão");
    await userEvent.type(
      screen.getByPlaceholderText("Conte pra gente o que achou do seu curso"),
      "Ótimo curso!"
    );
    await userEvent.click(screen.getByRole("button", { name: "Enviar" }));

    await waitFor(() => {
      expect(mockedSupportService.sendMessage).toHaveBeenCalledWith({
        subject: "Sugestão",
        message: "Ótimo curso!",
      });
      expect(onClose).toHaveBeenCalled();
    });
  });
});
