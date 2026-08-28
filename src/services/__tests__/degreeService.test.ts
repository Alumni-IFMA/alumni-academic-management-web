import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import { getMyDegrees, getDownloadUrl } from "../degreeService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

describe("degreeService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /degrees/me and returns the list of degrees", async () => {
    const mockDegrees = [
      { id: 1, title: "Bacharelado em Ciência da Computação", userId: 10, fileUrl: "http://minio/diplomas/1.pdf" },
    ];
    mockedApi.get.mockResolvedValue({ data: mockDegrees });

    const result = await getMyDegrees();

    expect(mockedApi.get).toHaveBeenCalledWith("/degrees/me");
    expect(result).toEqual(mockDegrees);
  });

  it("calls GET /degrees/{id}/download and returns the downloadUrl", async () => {
    mockedApi.get.mockResolvedValue({
      data: { downloadUrl: "http://minio/diplomas/1.pdf?X-Amz-Signature=xyz" },
    });

    const result = await getDownloadUrl(1);

    expect(mockedApi.get).toHaveBeenCalledWith("/degrees/1/download");
    expect(result).toBe("http://minio/diplomas/1.pdf?X-Amz-Signature=xyz");
  });
});
