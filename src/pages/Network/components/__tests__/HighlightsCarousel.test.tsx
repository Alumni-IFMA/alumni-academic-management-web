import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi } from "vitest";
import { HighlightsCarousel } from "../HighlightsCarousel";

const users = [{ id: 1, name: "João", subtitle: "Ciência da Computação" }];

describe("HighlightsCarousel", () => {
  it("renders a highlight card per user", () => {
    render(
      <MemoryRouter>
        <HighlightsCarousel users={users} loading={false} error={null} statusFor={() => "idle"} onConnect={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("João")).toBeInTheDocument();
    expect(screen.getByText("Ciência da Computação")).toBeInTheDocument();
  });

  it("shows skeletons while loading", () => {
    render(
      <MemoryRouter>
        <HighlightsCarousel users={[]} loading={true} error={null} statusFor={() => "idle"} onConnect={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Destaques")).toBeInTheDocument();
    expect(screen.queryByText("João")).not.toBeInTheDocument();
  });

  it("hides the connect button for already-connected users", () => {
    const connectedUsers = [{ id: 2, name: "Ana", connected: true }];
    render(
      <MemoryRouter>
        <HighlightsCarousel users={connectedUsers} loading={false} error={null} statusFor={() => "idle"} onConnect={vi.fn()} />
      </MemoryRouter>
    );
    expect(screen.getByText("Ana")).toBeInTheDocument();
    expect(screen.queryByText("Conectar")).not.toBeInTheDocument();
  });

  it("shows the error message when present", () => {
    render(
      <MemoryRouter>
        <HighlightsCarousel
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
