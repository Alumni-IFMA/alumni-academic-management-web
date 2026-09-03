import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import { saveJob, unsaveJob, getSavedJobs } from "../jobsService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

describe("jobsService saved jobs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("saveJob calls POST /jobs/{id}/save", async () => {
    mockedApi.post.mockResolvedValue({ data: {} });

    await saveJob(7);

    expect(mockedApi.post).toHaveBeenCalledWith("/jobs/7/save");
  });

  it("unsaveJob calls DELETE /jobs/{id}/save", async () => {
    mockedApi.delete.mockResolvedValue({ data: {} });

    await unsaveJob(7);

    expect(mockedApi.delete).toHaveBeenCalledWith("/jobs/7/save");
  });

  it("getSavedJobs calls GET /jobs/saved and returns the raw list", async () => {
    const jobs = [{ id: 1, title: "Vaga salva", company: "Empresa" }];
    mockedApi.get.mockResolvedValue({ data: jobs });

    const result = await getSavedJobs();

    expect(mockedApi.get).toHaveBeenCalledWith("/jobs/saved");
    expect(result).toEqual(jobs);
  });
});
