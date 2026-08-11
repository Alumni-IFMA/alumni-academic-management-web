import api from "./api";

/** GET /connections/suggestions?page=&size= */
async function getSuggestions({ page = 0, size = 8 } = {}) {
  const { data } = await api.get("/connections/suggestions", {
    params: { page, size },
  });
  return data;
}

/** POST /connections */
async function sendRequest(targetUserId) {
  const { data } = await api.post("/connections", { targetUserId });
  return data;
}

export default { getSuggestions, sendRequest };