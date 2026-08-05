import api from "./api";

export async function getLatestJobs() {
  const { data } = await api.get("/jobs", { params: { size: 2, sort: "createdAt,desc" } });
  return data;
}

export async function getJobs(params = {}) {
  const { data } = await api.get("/jobs", { params });
  return data;
}

export async function getJobById(id) {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
}
