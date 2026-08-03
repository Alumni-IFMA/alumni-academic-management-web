import api from "./api";

export async function setPassword({ token, newPassword }) {
  const { data } = await api.post("/auth/set-password", { token, newPassword });
  return data;
}

export async function forgotPassword({ email }) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
}

export async function verifyResetCode({ email, code }) {
  const { data } = await api.post("/auth/verify-reset-code", { email, code });
  return data;
}

export async function resetPassword({ token, newPassword }) {
  const { data } = await api.post("/auth/reset-password", { token, newPassword });
  return data;
}
