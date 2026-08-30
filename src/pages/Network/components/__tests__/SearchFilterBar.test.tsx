import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SearchFilterBar } from "../SearchFilterBar";

describe("SearchFilterBar", () => {
  it("calls onSearch with the trimmed query", async () => {
    const onSearch = vi.fn();
    render(<SearchFilterBar onSearch={onSearch} />);

    await userEvent.type(screen.getByPlaceholderText("Mentores, egressos e professores"), "  Maria  ");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));

    expect(onSearch).toHaveBeenCalledWith("Maria");
  });

  it("does not render a profile type filter", () => {
    render(<SearchFilterBar onSearch={vi.fn()} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
