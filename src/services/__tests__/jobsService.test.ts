import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import { getLatestJobs, getJobs, getJobById } from "../jobsService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

describe("jobsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /jobs?size=2&sort=createdAt,desc and returns data", async () => {
    const mockJobs = [
      { id: 1, title: "Dev Backend", companyName: "Mermãs Digitais", companyLogo: "/logo.png", location: "Imperatriz - MA", type: "Voluntário" },
    ];
    mockedApi.get.mockResolvedValue({ data: mockJobs });

    const result = await getLatestJobs();

    expect(mockedApi.get).toHaveBeenCalledWith("/jobs", { params: { size: 2, sort: "createdAt,desc" } });
    expect(result).toEqual(mockJobs);
  });

  it("calls GET /jobs with the given filters and returns the page response", async () => {
    const mockPage = {
      content: [{ id: 1, title: "Dev" }],
      totalPages: 3,
      number: 0,
      last: false,
    };
    mockedApi.get.mockResolvedValue({ data: mockPage });

    const result = await getJobs({ keyword: "java", page: 0, size: 10 });

    expect(mockedApi.get).toHaveBeenCalledWith("/jobs", { params: { keyword: "java", page: 0, size: 10 } });
    expect(result).toEqual(mockPage);
  });

  it("calls GET /jobs/{id} and returns the job", async () => {
    const mockJob = { id: 5, title: "Dev Backend" };
    mockedApi.get.mockResolvedValue({ data: mockJob });

    const result = await getJobById(5);

    expect(mockedApi.get).toHaveBeenCalledWith("/jobs/5");
    expect(result).toEqual(mockJob);
  });
});
