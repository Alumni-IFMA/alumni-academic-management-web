import api from "./api";

async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export default { register };