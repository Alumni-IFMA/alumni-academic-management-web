import api from "./api";

export async function sendMessage({ subject, message }) {
  const { data } = await api.post("/support", { subject, message });
  return data;
}
