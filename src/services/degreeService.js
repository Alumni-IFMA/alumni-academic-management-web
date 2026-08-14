import api from "./api";

export async function getMyDegrees() {
  const { data } = await api.get("/degrees/me");
  return data;
}

export async function getDownloadUrl(id) {
  const { data } = await api.get(`/degrees/${id}/download`);
  return data.downloadUrl;
}
