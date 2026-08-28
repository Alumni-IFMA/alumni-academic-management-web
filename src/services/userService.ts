import api from "./api";

export interface NetworkUser {
  id: number;
  name: string;
  role?: string;
  company?: string;
  location?: string;
  avatarUrl?: string | null;
}

export interface RegisterPayload {
  name: string;
  cpf: string;
  email: string;
  campusCourseId: number;
  entryYear: number;
  conclusionYear: number;
}

async function register(payload: RegisterPayload): Promise<unknown> {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

/** GET /users?highlight=true */
async function getHighlights(): Promise<NetworkUser[]> {
  const { data } = await api.get<NetworkUser[]>("/users", { params: { highlight: true } });
  return data;
}

/** GET /users/search?query= */
async function search(query: string): Promise<NetworkUser[]> {
  const { data } = await api.get<NetworkUser[]>("/users/search", { params: { query } });
  return data;
}

export default { register, getHighlights, search };
