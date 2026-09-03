import { useEffect, useState } from "react";
import networkAlumni, { type ConnectionResponseDto } from "../../../services/networkAlumni";
import { mapUser, type NetworkUser, type UserSimpleDto } from "../../../services/userService";
import { useAuth } from "../../../context/AuthContext";

function otherParticipant(connection: ConnectionResponseDto, myId: number): UserSimpleDto {
  return connection.requester.id === myId ? connection.addressee : connection.requester;
}

export function useSuggestions(): { users: NetworkUser[]; loading: boolean; error: string | null } {
  const { userId } = useAuth();
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const sentPromise = Promise.resolve(networkAlumni.getSentRequests())
      .then((data) => data ?? [])
      .catch(() => []);
    const acceptedPromise =
      userId == null
        ? Promise.resolve<ConnectionResponseDto[]>([])
        : Promise.resolve(networkAlumni.getAcceptedConnections())
            .then((data) => data ?? [])
            .catch(() => []);

    Promise.all([networkAlumni.getSuggestions(), sentPromise, acceptedPromise])
      .then(([suggestions, sent, accepted]) => {
        if (cancelled) return;

        // Once a request is sent (or accepted), the backend stops returning that
        // person from /connections/suggestions on the next fetch. Without merging
        // them back in, they'd vanish from the page entirely instead of showing
        // as already requested/connected.
        const seenIds = new Set(suggestions.map((user) => user.id));

        const requestedUsers = sent
          .map((connection) => mapUser(connection.addressee))
          .filter((user) => !seenIds.has(user.id));
        requestedUsers.forEach((user) => seenIds.add(user.id));

        const connectedUsers =
          userId == null
            ? []
            : accepted
                .map((connection) => ({ ...mapUser(otherParticipant(connection, userId)), connected: true }))
                .filter((user) => !seenIds.has(user.id));

        setUsers([...suggestions, ...requestedUsers, ...connectedUsers]);
      })
      .catch(() => {
        if (!cancelled) setError("Não foi possível carregar sugestões de conexão.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { users, loading, error };
}
