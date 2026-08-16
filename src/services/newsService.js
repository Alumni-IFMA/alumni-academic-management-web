import api from "./api";

export async function getLatestNews() {
  const { data } = await api.get("/news", { params: { size: 3 } });
  return data;
}

export async function getAdminNews(params = {}) {
  const { data } = await api.get("/news", { params });
  return data;
}

export async function getNewsById(id) {
  const { data } = await api.get(`/news/${id}`);
  return data;
}

export async function createNews(formData) {
  const { data } = await api.post("/news", formData);
  return data;
}

export async function updateNews(id, formData) {
  const { data } = await api.put(`/news/${id}`, formData);
  return data;
}

export async function deleteNews(id) {
  await api.delete(`/news/${id}`);
}
