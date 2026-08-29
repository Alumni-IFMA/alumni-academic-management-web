// Hook customizado para gerenciar o estado do botão conectar de forma isolada
import { useState, useCallback } from "react";
import networkAlumni from "../services/networkAlumni";

export type ConnectStatus = "idle" | "pending" | "sent" | "error";

/**
 * Controla o estado do botão "Conectar" por card, sem travar a lista inteira.
 * Retorna um mapa { [userId]: "idle" | "pending" | "sent" | "error" } e a função connect.
 */
export function useConnection() {
  const [status, setStatus] = useState<Record<number, ConnectStatus>>({});

  const connect = useCallback(async (userId: number) => {
    setStatus((prev) => ({ ...prev, [userId]: "pending" }));
    try {
      await networkAlumni.sendRequest(userId);
      setStatus((prev) => ({ ...prev, [userId]: "sent" }));
    } catch {
      setStatus((prev) => ({ ...prev, [userId]: "error" }));
    }
  }, []);

  const statusFor = useCallback(
    (userId: number): ConnectStatus => status[userId] ?? "idle",
    [status]
  );

  return { connect, statusFor };
}
