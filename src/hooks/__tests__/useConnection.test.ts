import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import networkAlumni from "../../services/networkAlumni";
import { useConnection } from "../useConnection";

vi.mock("../../services/networkAlumni");
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

const otherUser = { id: 1, name: "João", email: "j@x.com", status: "ACTIVE", role: "ALUMNI" as const, academicProfiles: [] };

describe("useConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([]);
  });

  it("defaults to idle for an unknown user", () => {
    const { result } = renderHook(() => useConnection());
    expect(result.current.statusFor(42)).toBe("idle");
  });

  it("seeds status 'sent' for users with an already-pending outgoing request", async () => {
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([
      { id: 5, requester: otherUser, addressee: otherUser, status: "PENDING" },
    ]);

    const { result } = renderHook(() => useConnection());

    await waitFor(() => expect(result.current.statusFor(1)).toBe("sent"));
  });

  it("connect() marks the user as sent on success", async () => {
    mockedNetworkAlumni.sendRequest.mockResolvedValue({});
    const { result } = renderHook(() => useConnection());

    await act(async () => {
      await result.current.connect(7);
    });

    expect(result.current.statusFor(7)).toBe("sent");
  });

  it("connect() marks the user as error on failure", async () => {
    mockedNetworkAlumni.sendRequest.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useConnection());

    await act(async () => {
      await result.current.connect(7);
    });

    expect(result.current.statusFor(7)).toBe("error");
  });
});
