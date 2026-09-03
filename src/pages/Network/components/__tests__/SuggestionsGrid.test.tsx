import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { SuggestionsGrid } from "../SuggestionsGrid";

const users = [{ id: 1, name: "Maria" }];

describe("SuggestionsGrid", () => {
  it("renders a suggestion card per user", () => {
    render(
      <MemoryRouter>
        <SuggestionsGrid users={users} loading={false} error={null} statusFor={() => "idle"} onConnect={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Maria")).toBeInTheDocument();
  });

  it("shows the empty state when there are no users and nothing is loading", () => {
    render(
      <MemoryRouter>
        <SuggestionsGrid users={[]} loading={false} error={null} statusFor={() => "idle"} onConnect={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Nenhuma sugestão de conexão no momento.")).toBeInTheDocument();
  });

  it("hides the connect button for already-connected users", () => {
    const connectedUsers = [{ id: 2, name: "Ana", connected: true }];
    render(
      <MemoryRouter>
        <SuggestionsGrid users={connectedUsers} loading={false} error={null} statusFor={() => "idle"} onConnect={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.queryByText("Conectar")).not.toBeInTheDocument();
  });

  it("shows the error message when present", () => {
    render(
      <MemoryRouter>
        <SuggestionsGrid
          users={[]}
          loading={false}
          error="Não foi possível carregar sugestões de conexão."
          statusFor={() => "idle"}
          onConnect={vi.fn()}
        />
      </MemoryRouter>
    );
    expect(screen.getByText("Não foi possível carregar sugestões de conexão.")).toBeInTheDocument();
  });
});
