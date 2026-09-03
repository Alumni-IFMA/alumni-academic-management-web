import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { ShortcutCards } from "../ShortcutCards";

vi.mock("../../../../services/supportService");

function renderCards() {
  return render(
    <MemoryRouter>
      <ShortcutCards />
    </MemoryRouter>
  );
}

describe("ShortcutCards", () => {
  it("opens the feedback modal when the Feedback card is clicked", async () => {
    renderCards();

    expect(screen.queryByText("Enviar feedback")).not.toBeInTheDocument();

    await userEvent.click(screen.getByText("Feedback"));

    expect(screen.getByText("Enviar feedback")).toBeInTheDocument();
  });

  it("closes the feedback modal via its X button", async () => {
    renderCards();

    await userEvent.click(screen.getByText("Feedback"));
    const modalHeading = screen.getByText("Enviar feedback");
    expect(modalHeading).toBeInTheDocument();

    // The X button is the only other button inside the modal header
    const closeButton = modalHeading.parentElement!.querySelector("button")!;
    await userEvent.click(closeButton);

    expect(screen.queryByText("Enviar feedback")).not.toBeInTheDocument();
  });
});
