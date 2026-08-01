import api from "./api";

export async function getLatestJobs() {
  const { data } = await api.get("/jobs", { params: { limit: 3 } });
  return data;
}
