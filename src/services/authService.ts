import api from "./api";

interface MessageResponse {
  message: string;
}

export async function setPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/auth/set-password", { token, newPassword });
  return data;
}

export async function forgotPassword({ email }: { email: string }): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/auth/forgot-password", { email });
  return data;
}

export async function verifyResetCode({
  email,
  code,
}: {
  email: string;
  code: string;
}): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/auth/verify-reset-code", { email, code });
  return data;
}

export async function resetPassword({
  token,
  newPassword,
}: {
  token: string;
  newPassword: string;
}): Promise<MessageResponse> {
  const { data } = await api.post<MessageResponse>("/auth/reset-password", { token, newPassword });
  return data;
}
