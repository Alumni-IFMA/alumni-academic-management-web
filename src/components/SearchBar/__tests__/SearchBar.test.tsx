import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { SearchBar } from "../SearchBar";

describe("SearchBar", () => {
  it("does not show a clear button when the value is empty", () => {
    render(<SearchBar value="" onChange={vi.fn()} />);
    expect(screen.queryByLabelText("Limpar busca")).not.toBeInTheDocument();
  });

  it("shows a clear button when there is text, and clears it on click", async () => {
    const onChange = vi.fn();
    render(<SearchBar value="Maria" onChange={onChange} />);

    const clearButton = screen.getByLabelText("Limpar busca");
    expect(clearButton).toBeInTheDocument();

    await userEvent.click(clearButton);

    expect(onChange).toHaveBeenCalledWith(expect.objectContaining({ target: expect.objectContaining({ value: "" }) }));
  });

  it("still calls onSearch when the button is clicked", async () => {
    const onSearch = vi.fn();
    render(<SearchBar value="Maria" onChange={vi.fn()} onSearch={onSearch} />);

    await userEvent.click(screen.getByRole("button", { name: "Buscar" }));

    expect(onSearch).toHaveBeenCalled();
  });
});
