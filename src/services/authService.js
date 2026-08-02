import api from "./api";

export async function setPassword({ token, newPassword }) {
  const { data } = await api.post("/auth/set-password", { token, newPassword });
  return data;
}
