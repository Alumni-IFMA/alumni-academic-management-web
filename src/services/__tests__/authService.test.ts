import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import { setPassword, forgotPassword, verifyResetCode, resetPassword } from "../authService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

describe("authService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls POST /auth/set-password with the token and new password", async () => {
    mockedApi.post.mockResolvedValue({ data: { message: "ok" } });

    const result = await setPassword({ token: "abc123", newPassword: "senha123" });

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/set-password", {
      token: "abc123",
      newPassword: "senha123",
    });
    expect(result).toEqual({ message: "ok" });
  });

  it("calls POST /auth/forgot-password with the email", async () => {
    mockedApi.post.mockResolvedValue({ data: { message: "ok" } });

    const result = await forgotPassword({ email: "user@test.com" });

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/forgot-password", { email: "user@test.com" });
    expect(result).toEqual({ message: "ok" });
  });

  it("calls POST /auth/verify-reset-code with the email and code", async () => {
    mockedApi.post.mockResolvedValue({ data: { message: "ok" } });

    const result = await verifyResetCode({ email: "user@test.com", code: "123456" });

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/verify-reset-code", {
      email: "user@test.com",
      code: "123456",
    });
    expect(result).toEqual({ message: "ok" });
  });

  it("calls POST /auth/reset-password with the token and new password", async () => {
    mockedApi.post.mockResolvedValue({ data: { message: "ok" } });

    const result = await resetPassword({ token: "123456", newPassword: "senha123" });

    expect(mockedApi.post).toHaveBeenCalledWith("/auth/reset-password", {
      token: "123456",
      newPassword: "senha123",
    });
    expect(result).toEqual({ message: "ok" });
  });
});
