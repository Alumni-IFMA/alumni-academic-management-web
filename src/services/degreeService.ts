import api from "./api";

export interface Degree {
  id: number;
  title: string;
  userId: number;
  fileUrl: string | null;
}

export async function getMyDegrees(): Promise<Degree[]> {
  const { data } = await api.get<Degree[]>("/degrees/me");
  return data;
}

export async function getDownloadUrl(id: number | string): Promise<string> {
  const { data } = await api.get<{ downloadUrl: string }>(`/degrees/${id}/download`);
  return data.downloadUrl;
}
