// Hook customizado para gerenciar o estado do botão conectar de forma isolada
import { useState, useCallback, useEffect } from "react";
import networkAlumni from "../services/networkAlumni";

export type ConnectStatus = "idle" | "pending" | "sent" | "error";

/**
 * Controla o estado do botão "Conectar" por card, sem travar a lista inteira.
 * Pré-carrega quem já tem solicitação pendente enviada, pra não deixar
 * reenviar depois de um reload da página.
 */
export function useConnection() {
  const [status, setStatus] = useState<Record<number, ConnectStatus>>({});

  useEffect(() => {
    let cancelled = false;
    networkAlumni
      .getSentRequests()
      .then((sent) => {
        if (cancelled) return;
        setStatus((prev) => {
          const next = { ...prev };
          sent.forEach((connection) => {
            next[connection.addressee.id] = "sent";
          });
          return next;
        });
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

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
