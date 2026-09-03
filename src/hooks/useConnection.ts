// Hook customizado para gerenciar o estado do botão conectar de forma isolada
import { useState, useCallback, useEffect } from "react";
import networkAlumni from "../services/networkAlumni";
import { useAuth } from "../context/AuthContext";

export type ConnectStatus = "idle" | "pending" | "sent" | "connected" | "error";

/**
 * Controla o estado do botão "Conectar" por card, sem travar a lista inteira.
 * Pré-carrega quem já tem solicitação pendente enviada e quem já é conexão
 * aceita, pra não deixar reenviar nem mostrar "Conectar" pra quem já conectou.
 */
export function useConnection() {
  const { userId: myUserId } = useAuth();
  const [status, setStatus] = useState<Record<number, ConnectStatus>>({});
  const [connectionIdFor, setConnectionIdFor] = useState<Record<number, number>>({});

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

    if (myUserId != null) {
      networkAlumni
        .getAcceptedConnections()
        .then((accepted) => {
          if (cancelled) return;
          const otherIdOf = (connection: (typeof accepted)[number]) =>
            connection.requester.id === myUserId ? connection.addressee.id : connection.requester.id;

          setStatus((prev) => {
            const next = { ...prev };
            accepted.forEach((connection) => {
              next[otherIdOf(connection)] = "connected";
            });
            return next;
          });
          setConnectionIdFor((prev) => {
            const next = { ...prev };
            accepted.forEach((connection) => {
              next[otherIdOf(connection)] = connection.id;
            });
            return next;
          });
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, [myUserId]);

  const connect = useCallback(async (userId: number) => {
    setStatus((prev) => ({ ...prev, [userId]: "pending" }));
    try {
      await networkAlumni.sendRequest(userId);
      setStatus((prev) => ({ ...prev, [userId]: "sent" }));
    } catch {
      setStatus((prev) => ({ ...prev, [userId]: "error" }));
    }
  }, []);

  const disconnect = useCallback(
    async (userId: number) => {
      const connectionId = connectionIdFor[userId];
      if (connectionId == null) return;

      await networkAlumni.declineConnection(connectionId);
      setStatus((prev) => ({ ...prev, [userId]: "idle" }));
      setConnectionIdFor((prev) => {
        const next = { ...prev };
        delete next[userId];
        return next;
      });
    },
    [connectionIdFor]
  );

  const statusFor = useCallback(
    (userId: number): ConnectStatus => status[userId] ?? "idle",
    [status]
  );

  return { connect, disconnect, statusFor };
}
