import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import networkAlumni from "../../../../services/networkAlumni";
import { useSuggestions } from "../useSuggestions";

vi.mock("../../../../services/networkAlumni");
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

describe("useSuggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads suggestions on mount", async () => {
    mockedNetworkAlumni.getSuggestions.mockResolvedValue([{ id: 1, name: "João" }]);
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([]);

    const { result } = renderHook(() => useSuggestions());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toEqual([{ id: 1, name: "João" }]);
    expect(result.current.error).toBeNull();
  });

  it("sets an error message when the request fails", async () => {
    mockedNetworkAlumni.getSuggestions.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useSuggestions());

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

    const { result } = renderHook(() => useSuggestions());

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

    const { result } = renderHook(() => useSuggestions());

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.users).toHaveLength(1);
  });
});
