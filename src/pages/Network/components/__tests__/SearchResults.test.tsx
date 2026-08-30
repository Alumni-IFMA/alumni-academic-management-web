import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import type { ReactElement } from "react";
import { SearchResults } from "../SearchResults";

const users = [
  { id: 1, name: "Maria Silva", subtitle: "Ciência da Computação" },
  { id: 2, name: "João Souza", subtitle: "Engenharia" },
];

function renderWithRouter(ui: ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>);
}

describe("SearchResults", () => {
  it("shows only users matching the query by name", () => {
    renderWithRouter(<SearchResults query="Maria" users={users} statusFor={() => "idle"} onConnect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("Maria Silva")).toBeInTheDocument();
    expect(screen.queryByText("João Souza")).not.toBeInTheDocument();
  });

  it("shows the empty state when nothing matches", () => {
    renderWithRouter(<SearchResults query="Zzz" users={users} statusFor={() => "idle"} onConnect={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByText("Nenhum perfil encontrado para essa busca.")).toBeInTheDocument();
  });

  it("calls onClear when the clear button is clicked", async () => {
    const onClear = vi.fn();
    renderWithRouter(<SearchResults query="Maria" users={users} statusFor={() => "idle"} onConnect={vi.fn()} onClear={onClear} />);
    screen.getByText("Limpar busca").click();
    expect(onClear).toHaveBeenCalled();
  });
});
