import api from "./api";
import { mapUser, type NetworkUser, type UserSimpleDto } from "./userService";

export interface ConnectionResponseDto {
  id: number;
  requester: UserSimpleDto;
  addressee: UserSimpleDto;
  status: "PENDING" | "ACCEPTED";
}

interface PageUserSimpleDto {
  content: UserSimpleDto[];
}

/** GET /connections/suggestions */
async function getSuggestions(): Promise<NetworkUser[]> {
  const { data } = await api.get<PageUserSimpleDto>("/connections/suggestions");
  return data.content.map(mapUser);
}

/** POST /connections */
async function sendRequest(addresseeId: number): Promise<unknown> {
  const { data } = await api.post("/connections", { addresseeId });
  return data;
}

/** GET /connections/sent */
async function getSentRequests(): Promise<ConnectionResponseDto[]> {
  const { data } = await api.get<ConnectionResponseDto[]>("/connections/sent");
  return data;
}

export default { getSuggestions, sendRequest, getSentRequests };
