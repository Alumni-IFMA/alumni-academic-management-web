import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import type { ReactNode } from "react";
import networkAlumni from "../../../../services/networkAlumni";
import { AuthContext } from "../../../../context/AuthContext";
import { useSuggestions } from "../useSuggestions";

vi.mock("../../../../services/networkAlumni");
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

const fakeAuth = { isAuthenticated: true, userName: "Eu", userId: 42, login: vi.fn(), logout: vi.fn() };

function wrapper({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={fakeAuth}>{children}</AuthContext.Provider>;
}

function renderSuggestions() {
  return renderHook(() => useSuggestions(), { wrapper });
}

describe("useSuggestions", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([]);
    mockedNetworkAlumni.getAcceptedConnections.mockResolvedValue([]);
  });

  it("loads suggestions on mount", async () => {
    mockedNetworkAlumni.getSuggestions.mockResolvedValue([{ id: 1, name: "João" }]);

    const { result } = renderSuggestions();

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toEqual([{ id: 1, name: "João" }]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the request fails", async () => {
    mockedNetworkAlumni.getSuggestions.mockRejectedValue(new Error("network error"));

    const { result } = renderSuggestions();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toEqual([]);
    expect(result.current.error).toBe("Não foi possível carregar sugestões de conexão.");
  });

  it("keeps a person visible after a connection request removes them from suggestions", async () => {
    // Regression test: the backend excludes anyone with a pending sent request from
    // /connections/suggestions on the next fetch, which made them vanish from the
    // Rede page entirely after a reload. They should stay visible as "already requested".
    mockedNetworkAlumni.getSuggestions.mockResolvedValue([{ id: 1, name: "João" }]);
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([
      {
        id: 99,
        requester: { id: 42, name: "Eu", email: "eu@example.com", status: "ACTIVE", role: "ALUMNI" },
        addressee: { id: 2, name: "Maria", email: "maria@example.com", status: "ACTIVE", role: "ALUMNI" },
        status: "PENDING",
      },
    ]);

    const { result } = renderSuggestions();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users.map((u) => u.name)).toEqual(["João", "Maria"]);
  });

  it("does not duplicate a user who is both a suggestion and a pending sent request", async () => {
    mockedNetworkAlumni.getSuggestions.mockResolvedValue([{ id: 1, name: "João" }]);
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([
      {
        id: 99,
        requester: { id: 42, name: "Eu", email: "eu@example.com", status: "ACTIVE", role: "ALUMNI" },
        addressee: { id: 1, name: "João", email: "joao@example.com", status: "ACTIVE", role: "ALUMNI" },
        status: "PENDING",
      },
    ]);

    const { result } = renderSuggestions();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toHaveLength(1);
  });

  it("keeps accepted connections visible, marked as already connected", async () => {
    mockedNetworkAlumni.getSuggestions.mockResolvedValue([{ id: 1, name: "João" }]);
    mockedNetworkAlumni.getAcceptedConnections.mockResolvedValue([
      {
        id: 50,
        requester: { id: 42, name: "Eu", email: "eu@example.com", status: "ACTIVE", role: "ALUMNI" },
        addressee: { id: 3, name: "Pedro", email: "pedro@example.com", status: "ACTIVE", role: "ALUMNI" },
        status: "ACCEPTED",
      },
    ]);

    const { result } = renderSuggestions();

    await waitFor(() => expect(result.current.loading).toBe(false));
    const pedro = result.current.users.find((u) => u.name === "Pedro");
    expect(pedro?.connected).toBe(true);
  });

  it("resolves the other participant regardless of which side sent the original request", async () => {
    mockedNetworkAlumni.getSuggestions.mockResolvedValue([]);
    mockedNetworkAlumni.getAcceptedConnections.mockResolvedValue([
      {
        id: 51,
        // this time I'm the addressee, not the requester
        requester: { id: 7, name: "Ana", email: "ana@example.com", status: "ACTIVE", role: "ALUMNI" },
        addressee: { id: 42, name: "Eu", email: "eu@example.com", status: "ACTIVE", role: "ALUMNI" },
        status: "ACCEPTED",
      },
    ]);

    const { result } = renderSuggestions();

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users.map((u) => u.name)).toEqual(["Ana"]);
  });
});
