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
});
