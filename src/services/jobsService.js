import api from "./api";

export async function getLatestJobs() {
  const { data } = await api.get("/jobs", { params: { size: 2, sort: "createdAt,desc" } });
  return data;
}
