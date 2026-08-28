import api from "./api";

export async function sendMessage({
  subject,
  message,
}: {
  subject: string;
  message: string;
}): Promise<unknown> {
  const { data } = await api.post("/support", { subject, message });
  return data;
}
