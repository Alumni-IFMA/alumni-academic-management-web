import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { Notifications } from "../index";
import networkAlumni from "../../../services/networkAlumni";

vi.mock("../../../services/networkAlumni");
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

function renderPage() {
  return render(
    <MemoryRouter>
      <Notifications />
    </MemoryRouter>
  );
}

const requesterDto = {
  id: 3,
  name: "Ana Souza",
  email: "ana@example.com",
  status: "ACTIVE",
  role: "ALUMNI",
  academicProfiles: [
    { id: 1, entryYear: 2018, conclusionYear: 2022, campusName: "Campus São Luís", courseName: "ADS", level: "GRADUACAO", modality: "BACHARELADO" },
  ],
};

const pending = [{ id: 10, requester: requesterDto, addressee: requesterDto, status: "PENDING" as const }];

describe("Notifications", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows the empty state when there are no pending requests", async () => {
    mockedNetworkAlumni.getPendingRequests.mockResolvedValue([]);
    renderPage();

    expect(await screen.findByText("Nenhuma solicitação de conexão pendente.")).toBeInTheDocument();
  });

  it("shows a back button", async () => {
    mockedNetworkAlumni.getPendingRequests.mockResolvedValue([]);
    renderPage();

    expect(await screen.findByLabelText("Voltar")).toBeInTheDocument();
  });

  it("lists pending connection requests", async () => {
    mockedNetworkAlumni.getPendingRequests.mockResolvedValue(pending);
    renderPage();

    expect(await screen.findByText("Ana Souza")).toBeInTheDocument();
  });

  it("accepts a request and removes it from the list", async () => {
    mockedNetworkAlumni.getPendingRequests.mockResolvedValue(pending);
    mockedNetworkAlumni.acceptConnection.mockResolvedValue(undefined);
    renderPage();

    await screen.findByText("Ana Souza");
    await userEvent.click(screen.getByRole("button", { name: "Aceitar" }));

    await waitFor(() => {
      expect(mockedNetworkAlumni.acceptConnection).toHaveBeenCalledWith(10);
      expect(screen.queryByText("Ana Souza")).not.toBeInTheDocument();
    });
  });

  it("declines a request and removes it from the list", async () => {
    mockedNetworkAlumni.getPendingRequests.mockResolvedValue(pending);
    mockedNetworkAlumni.declineConnection.mockResolvedValue(undefined);
    renderPage();

    await screen.findByText("Ana Souza");
    await userEvent.click(screen.getByRole("button", { name: "Recusar" }));

    await waitFor(() => {
      expect(mockedNetworkAlumni.declineConnection).toHaveBeenCalledWith(10);
      expect(screen.queryByText("Ana Souza")).not.toBeInTheDocument();
    });
  });

  it("shows an error message when loading fails", async () => {
    mockedNetworkAlumni.getPendingRequests.mockRejectedValue(new Error("network error"));
    renderPage();

    expect(await screen.findByText("Não foi possível carregar as notificações.")).toBeInTheDocument();
  });
});
