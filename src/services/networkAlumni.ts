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

/** GET /connections/pending */
async function getPendingRequests(): Promise<ConnectionResponseDto[]> {
  const { data } = await api.get<ConnectionResponseDto[]>("/connections/pending");
  return data;
}

/** GET /connections */
async function getAcceptedConnections(): Promise<ConnectionResponseDto[]> {
  const { data } = await api.get<ConnectionResponseDto[]>("/connections");
  return data;
}

/** PATCH /connections/{id}/accept */
async function acceptConnection(id: number): Promise<void> {
  await api.patch(`/connections/${id}/accept`);
}

/** DELETE /connections/{id} */
async function declineConnection(id: number): Promise<void> {
  await api.delete(`/connections/${id}`);
}

export default {
  getSuggestions,
  sendRequest,
  getSentRequests,
  getPendingRequests,
  getAcceptedConnections,
  acceptConnection,
  declineConnection,
};
