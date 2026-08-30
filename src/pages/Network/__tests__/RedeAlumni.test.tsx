import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { MemoryRouter } from "react-router-dom";
import RedeAlumni from "../RedeAlumni";
import networkAlumni from "../../../services/networkAlumni";

vi.mock("../../../services/networkAlumni");
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

const users = Array.from({ length: 9 }, (_, i) => ({ id: i + 1, name: `Alumni ${i + 1}` }));

function renderPage() {
  return render(
    <MemoryRouter>
      <RedeAlumni />
    </MemoryRouter>
  );
}

describe("RedeAlumni", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNetworkAlumni.getSuggestions.mockResolvedValue(users);
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([]);
  });

  it("splits the first 8 suggestions into Destaques and the rest into the grid", async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getByText("Alumni 1")).toBeInTheDocument();
      expect(screen.getByText("Alumni 9")).toBeInTheDocument();
    });
  });

  it("shows search results and lets the user clear them", async () => {
    renderPage();
    await waitFor(() => expect(screen.getByText("Alumni 1")).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText("Mentores, egressos e professores"), "Alumni 3");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));

    expect(await screen.findByText('Resultados para "Alumni 3"')).toBeInTheDocument();

    await userEvent.click(screen.getByText("Limpar busca"));
    expect(screen.queryByText(/Resultados para/)).not.toBeInTheDocument();
  });
});
