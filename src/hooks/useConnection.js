// Hook customizado para gerenciar o estado do botão conectar de forma isolada
import { useState, useCallback } from "react";
import networkAlumni from "../services/networkAlumni";

/**
 * Controla o estado do botão "Conectar" por card, sem travar a lista inteira.
 * Retorna um mapa { [userId]: "idle" | "pending" | "sent" | "error" } e a função connect.
 */
export function useConnection() {
  const [status, setStatus] = useState({});

  const connect = useCallback(async (userId) => {
    setStatus((prev) => ({ ...prev, [userId]: "pending" }));
    try {
      await networkAlumni.sendRequest(userId);
      setStatus((prev) => ({ ...prev, [userId]: "sent" }));
    } catch (err) {
      setStatus((prev) => ({ ...prev, [userId]: "error" }));
    }
  }, []);

  const statusFor = useCallback((userId) => status[userId] ?? "idle", [status]);

  return { connect, statusFor };
}