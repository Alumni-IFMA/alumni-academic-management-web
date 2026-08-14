import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../api";
import { getLatestJobs, getJobs, getJobById } from "../jobsService";

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

  it("calls GET /jobs with the given filters and returns the page response", async () => {
    const mockPage = {
      content: [{ id: 1, title: "Dev" }],
      totalPages: 3,
      number: 0,
      last: false,
    };
    api.get.mockResolvedValue({ data: mockPage });

    const result = await getJobs({ keyword: "java", page: 0, size: 10 });

    expect(api.get).toHaveBeenCalledWith("/jobs", { params: { keyword: "java", page: 0, size: 10 } });
    expect(result).toEqual(mockPage);
  });

  it("calls GET /jobs/{id} and returns the job", async () => {
    const mockJob = { id: 5, title: "Dev Backend" };
    api.get.mockResolvedValue({ data: mockJob });

    const result = await getJobById(5);

    expect(api.get).toHaveBeenCalledWith("/jobs/5");
    expect(result).toEqual(mockJob);
  });
});
