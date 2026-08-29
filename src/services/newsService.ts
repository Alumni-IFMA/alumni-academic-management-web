import api, { type Page } from "./api";

export interface NewsRawDto {
  id: number;
  title: string;
  summary?: string | null;
  content?: string | null;
  coverImageUrl?: string | null;
  draft: boolean;
  publishedAt?: string | number[] | null;
  createdAt?: string | number[] | null;
}

export async function getLatestNews(): Promise<NewsRawDto[]> {
  const { data } = await api.get<NewsRawDto[]>("/news", { params: { size: 3 } });
  return data;
}

export async function getAdminNews(
  params: Record<string, unknown> = {}
): Promise<NewsRawDto[] | Page<NewsRawDto>> {
  const { data } = await api.get<NewsRawDto[] | Page<NewsRawDto>>("/news", { params });
  return data;
}

export async function getNews(
  params: Record<string, unknown> = {}
): Promise<NewsRawDto[] | Page<NewsRawDto>> {
  const { data } = await api.get<NewsRawDto[] | Page<NewsRawDto>>("/news", { params });
  return data;
}

export async function getNewsById(id: number | string): Promise<NewsRawDto> {
  const { data } = await api.get<NewsRawDto>(`/news/${id}`);
  return data;
}

export async function createNews(formData: FormData): Promise<NewsRawDto> {
  const { data } = await api.post<NewsRawDto>("/news", formData);
  return data;
}

export async function updateNews(id: number | string, formData: FormData): Promise<NewsRawDto> {
  const { data } = await api.put<NewsRawDto>(`/news/${id}`, formData);
  return data;
}

export async function deleteNews(id: number | string): Promise<void> {
  await api.delete(`/news/${id}`);
}
