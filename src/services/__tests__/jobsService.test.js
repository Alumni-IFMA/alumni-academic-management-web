import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../api";
import { getLatestJobs } from "../jobsService";

vi.mock("../api");

describe("jobsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /jobs?limit=3 and returns data", async () => {
    const mockJobs = [
      { id: 1, title: "Dev Backend", companyName: "Mermãs Digitais", companyLogo: "/logo.png", location: "Imperatriz - MA", type: "Voluntário" },
    ];
    api.get.mockResolvedValue({ data: mockJobs });

    const result = await getLatestJobs();

    expect(api.get).toHaveBeenCalledWith("/jobs", { params: { limit: 3 } });
    expect(result).toEqual(mockJobs);
  });
});
