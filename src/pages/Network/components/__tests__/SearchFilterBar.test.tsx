import { render, screen, waitFor } from "@testing-library/react";
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

  it("calls onSearch automatically (debounced) as the user types, without needing Buscar", async () => {
    const onSearch = vi.fn();
    render(<SearchFilterBar onSearch={onSearch} />);

    await userEvent.type(screen.getByPlaceholderText("Mentores, egressos e professores"), "Maria");

    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("Maria"), { timeout: 1000 });
  });

  it("calls onSearch with an empty string once the field is cleared", async () => {
    const onSearch = vi.fn();
    render(<SearchFilterBar onSearch={onSearch} />);

    const input = screen.getByPlaceholderText("Mentores, egressos e professores");
    await userEvent.type(input, "Maria");
    await waitFor(() => expect(onSearch).toHaveBeenCalledWith("Maria"), { timeout: 1000 });

    await userEvent.clear(input);
    await waitFor(() => expect(onSearch).toHaveBeenLastCalledWith(""), { timeout: 1000 });
  });

  it("does not render a profile type filter", () => {
    render(<SearchFilterBar onSearch={vi.fn()} />);
    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();
  });
});
