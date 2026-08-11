import api from "./api";

async function register(payload) {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

/** GET /users?highlight=true */
async function getHighlights() {
  const { data } = await api.get("/users", { params: { highlight: true } });
  return data;
}

/** GET /users/search?query= */
async function search(query) {
  const { data } = await api.get("/users/search", { params: { query } });
  return data;
}

export default { register, getHighlights, search };