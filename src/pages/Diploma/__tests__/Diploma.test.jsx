import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { Diploma } from "../index";
import * as degreeService from "../../../services/degreeService";

vi.mock("../../../services/degreeService");

const mockDegrees = [
  { id: 1, title: "Bacharelado em Ciência da Computação", userId: 10, fileUrl: "http://minio/diplomas/1.pdf" },
  { id: 2, title: "Técnico em Informática", userId: 10, fileUrl: "" },
];

function renderDiploma() {
  return render(
    <MemoryRouter initialEntries={["/diploma"]}>
      <Diploma />
    </MemoryRouter>
  );
}

describe("Diploma page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the title and a back button", async () => {
    degreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    renderDiploma();
    expect(screen.getByText("Baixe seu diploma")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
    await waitFor(() => expect(degreeService.getMyDegrees).toHaveBeenCalled());
  });

  it("shows the course dropdown populated after loading", async () => {
    degreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    renderDiploma();
    await waitFor(() => {
      expect(screen.getByText("Bacharelado em Ciência da Computação")).toBeInTheDocument();
      expect(screen.getByText("Técnico em Informática")).toBeInTheDocument();
    });
  });

  it("shows an error message when loading degrees fails", async () => {
    degreeService.getMyDegrees.mockRejectedValue(new Error("network error"));
    renderDiploma();
    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar seus cursos.")).toBeInTheDocument();
    });
  });

  it("shows an empty state message when the user has no degrees", async () => {
    degreeService.getMyDegrees.mockResolvedValue([]);
    renderDiploma();
    await waitFor(() => {
      expect(screen.getByText("Você ainda não possui diploma disponível.")).toBeInTheDocument();
    });
  });
});
