import api, { type Page } from "./api";
import type { NetworkUser } from "./userService";

/** GET /connections/suggestions?page=&size= */
async function getSuggestions({
  page = 0,
  size = 8,
}: { page?: number; size?: number } = {}): Promise<Page<NetworkUser>> {
  const { data } = await api.get<Page<NetworkUser>>("/connections/suggestions", {
    params: { page, size },
  });
  return data;
}

/** POST /connections */
async function sendRequest(targetUserId: number): Promise<unknown> {
  const { data } = await api.post("/connections", { targetUserId });
  return data;
}

export default { getSuggestions, sendRequest };
