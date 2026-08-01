import api from "./api";

async function getAll() {
  const { data } = await api.get("/campus-courses");
  return data;
}

export default { getAll };