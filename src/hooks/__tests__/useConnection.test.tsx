import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import type { ReactNode } from "react";
import networkAlumni from "../../services/networkAlumni";
import { AuthContext } from "../../context/AuthContext";
import { useConnection } from "../useConnection";

vi.mock("../../services/networkAlumni");
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

const otherUser = { id: 1, name: "João", email: "j@x.com", status: "ACTIVE", role: "ALUMNI" as const, academicProfiles: [] };
const meUser = { id: 99, name: "Kenia", email: "k@x.com", status: "ACTIVE", role: "ALUMNI" as const, academicProfiles: [] };

const fakeAuth = { isAuthenticated: true, userName: "Kenia", userId: 99, login: vi.fn(), logout: vi.fn() };

function wrapper({ children }: { children: ReactNode }) {
  return <AuthContext.Provider value={fakeAuth}>{children}</AuthContext.Provider>;
}

describe("useConnection", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([]);
    mockedNetworkAlumni.getAcceptedConnections.mockResolvedValue([]);
  });

  it("defaults to idle for an unknown user", () => {
    const { result } = renderHook(() => useConnection(), { wrapper });
    expect(result.current.statusFor(42)).toBe("idle");
  });

  it("seeds status 'sent' for users with an already-pending outgoing request", async () => {
    mockedNetworkAlumni.getSentRequests.mockResolvedValue([
      { id: 5, requester: otherUser, addressee: otherUser, status: "PENDING" },
    ]);

    const { result } = renderHook(() => useConnection(), { wrapper });

    await waitFor(() => expect(result.current.statusFor(1)).toBe("sent"));
  });

  it("seeds status 'connected' for users with an already-accepted connection", async () => {
    mockedNetworkAlumni.getAcceptedConnections.mockResolvedValue([
      { id: 8, requester: meUser, addressee: otherUser, status: "ACCEPTED" },
    ]);

    const { result } = renderHook(() => useConnection(), { wrapper });

    await waitFor(() => expect(result.current.statusFor(1)).toBe("connected"));
  });

  it("connect() marks the user as sent on success", async () => {
    mockedNetworkAlumni.sendRequest.mockResolvedValue({});
    const { result } = renderHook(() => useConnection(), { wrapper });

    await act(async () => {
      await result.current.connect(7);
    });

    expect(result.current.statusFor(7)).toBe("sent");
  });

  it("connect() marks the user as error on failure", async () => {
    mockedNetworkAlumni.sendRequest.mockRejectedValue(new Error("boom"));
    const { result } = renderHook(() => useConnection(), { wrapper });

    await act(async () => {
      await result.current.connect(7);
    });

    expect(result.current.statusFor(7)).toBe("error");
  });

  it("disconnect() reverts an accepted connection back to idle", async () => {
    mockedNetworkAlumni.getAcceptedConnections.mockResolvedValue([
      { id: 8, requester: meUser, addressee: otherUser, status: "ACCEPTED" },
    ]);
    mockedNetworkAlumni.declineConnection.mockResolvedValue(undefined);

    const { result } = renderHook(() => useConnection(), { wrapper });
    await waitFor(() => expect(result.current.statusFor(1)).toBe("connected"));

    await act(async () => {
      await result.current.disconnect(1);
    });

    expect(mockedNetworkAlumni.declineConnection).toHaveBeenCalledWith(8);
    expect(result.current.statusFor(1)).toBe("idle");
  });
});
