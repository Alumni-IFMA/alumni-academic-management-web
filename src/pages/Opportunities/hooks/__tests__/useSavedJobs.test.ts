import { renderHook, waitFor, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import * as jobsService from "../../../../services/jobsService";
import { useSavedJobs } from "../useSavedJobs";

vi.mock("../../../../services/jobsService");
const mockedJobsService = jobsService as Mocked<typeof jobsService>;

const jobDto = { id: 1, title: "Vaga A", company: "Empresa A", requirements: [], benefits: [] };

describe("useSavedJobs", () => {
  beforeEach(() => vi.clearAllMocks());

  it("loads saved jobs on mount", async () => {
    mockedJobsService.getSavedJobs.mockResolvedValue([jobDto]);

    const { result } = renderHook(() => useSavedJobs());

    expect(result.current.loading).toBe(true);
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.savedJobs).toHaveLength(1);
    expect(result.current.savedJobs[0].title).toBe("Vaga A");
    expect(result.current.isSaved(1)).toBe(true);
    expect(result.current.isSaved(2)).toBe(false);
  });

  it("toggleSave optimistically removes an already-saved job and calls unsaveJob", async () => {
    mockedJobsService.getSavedJobs.mockResolvedValue([jobDto]);
    mockedJobsService.unsaveJob.mockResolvedValue(undefined);

    const { result } = renderHook(() => useSavedJobs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => result.current.toggleSave(result.current.savedJobs[0]));

    expect(result.current.isSaved(1)).toBe(false);
    expect(result.current.savedJobs).toHaveLength(0);
    await waitFor(() => expect(mockedJobsService.unsaveJob).toHaveBeenCalledWith(1));
  });

  it("toggleSave reverts when the save request fails", async () => {
    mockedJobsService.getSavedJobs.mockResolvedValue([]);
    mockedJobsService.saveJob.mockRejectedValue(new Error("network error"));

    const { result } = renderHook(() => useSavedJobs());
    await waitFor(() => expect(result.current.loading).toBe(false));

    const job = { id: 5, companyName: "Empresa B", title: "Vaga B", location: "", postedAt: "", tags: [], requirements: [], benefits: [] };
    act(() => result.current.toggleSave(job));

    expect(result.current.isSaved(5)).toBe(true);
    await waitFor(() => expect(result.current.isSaved(5)).toBe(false));
  });
});
