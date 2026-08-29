import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { FilterCard } from "../FilterCard";

function renderFilterCard(overrides = {}) {
  const props = {
    location: "",
    onLocationChange: vi.fn(),
    area: "",
    onAreaChange: vi.fn(),
    experience: [],
    onExperienceToggle: vi.fn(),
    remoteOnly: false,
    onRemoteOnlyChange: vi.fn(),
    ...overrides,
  };
  render(<FilterCard {...props} />);
  return props;
}

describe("FilterCard", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the title by default", () => {
    renderFilterCard();
    expect(screen.getByText("Filtros")).toBeInTheDocument();
  });

  it("hides the title when hideTitle is true", () => {
    renderFilterCard({ hideTitle: true });
    expect(screen.queryByText("Filtros")).not.toBeInTheDocument();
  });

  it("calls onLocationChange as the user types", async () => {
    const props = renderFilterCard();
    await userEvent.type(screen.getByPlaceholderText("Cidade, estado ou remoto"), "SP");
    expect(props.onLocationChange).toHaveBeenCalled();
  });

  it("reflects the location value from props", () => {
    renderFilterCard({ location: "Imperatriz" });
    expect(screen.getByPlaceholderText("Cidade, estado ou remoto")).toHaveValue("Imperatriz");
  });

  it("calls onAreaChange with the selected area", async () => {
    const props = renderFilterCard();
    await userEvent.selectOptions(screen.getByDisplayValue("Selecione uma opção"), "Design");
    expect(props.onAreaChange).toHaveBeenCalledWith("Design");
  });

  it("calls onExperienceToggle with the checkbox's enum id", async () => {
    const props = renderFilterCard();
    await userEvent.click(screen.getByLabelText("Júnior"));
    expect(props.onExperienceToggle).toHaveBeenCalledWith("JUNIOR");
  });

  it("reflects checked experience levels from props", () => {
    renderFilterCard({ experience: ["SENIOR"] });
    expect(screen.getByLabelText("Sênior")).toBeChecked();
    expect(screen.getByLabelText("Júnior")).not.toBeChecked();
  });

  it("calls onRemoteOnlyChange with the toggled value", async () => {
    const props = renderFilterCard({ remoteOnly: false });
    await userEvent.click(screen.getByRole("button", { name: "Apenas remoto" }));
    expect(props.onRemoteOnlyChange).toHaveBeenCalledWith(true);
  });
});
