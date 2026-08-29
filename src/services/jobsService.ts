import api, { type Page } from "./api";

export interface JobRawDto {
  id: number;
  company: string;
  companyLogoUrl?: string | null;
  title: string;
  location: string;
  createdAt?: number[] | null;
  description?: string;
  workplaceType?: "REMOTE" | "HYBRID" | "ON_SITE" | null;
  experienceLevel?: "INTERNSHIP" | "JUNIOR" | "MID" | "SENIOR" | null;
  requirements?: string[];
  benefits?: string[];
}

export async function getLatestJobs(): Promise<JobRawDto[]> {
  const { data } = await api.get<JobRawDto[]>("/jobs", {
    params: { size: 2, sort: "createdAt,desc" },
  });
  return data;
}

export async function getJobs(params: Record<string, unknown> = {}): Promise<Page<JobRawDto>> {
  const { data } = await api.get<Page<JobRawDto>>("/jobs", { params });
  return data;
}

export async function getJobById(id: number | string): Promise<JobRawDto> {
  const { data } = await api.get<JobRawDto>(`/jobs/${id}`);
  return data;
}
