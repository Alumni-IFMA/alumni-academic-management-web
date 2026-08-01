import api from "./api";

export async function getLatestNews() {
  const { data } = await api.get("/news", { params: { limit: 3 } });
  return data;
}
