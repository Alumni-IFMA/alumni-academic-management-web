import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../api";
import { setPassword } from "../authService";

vi.mock("../api");

describe("authService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls POST /auth/set-password with the token and new password", async () => {
    api.post.mockResolvedValue({ data: { message: "ok" } });

    const result = await setPassword({ token: "abc123", newPassword: "senha123" });

    expect(api.post).toHaveBeenCalledWith("/auth/set-password", {
      token: "abc123",
      newPassword: "senha123",
    });
    expect(result).toEqual({ message: "ok" });
  });
});
