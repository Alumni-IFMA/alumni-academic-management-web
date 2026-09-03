import { useEffect, useState } from "react";
import networkAlumni from "../../../services/networkAlumni";
import { mapUser, type NetworkUser } from "../../../services/userService";

export function useSuggestions(): { users: NetworkUser[]; loading: boolean; error: string | null } {
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      networkAlumni.getSuggestions(),
      Promise.resolve(networkAlumni.getSentRequests())
        .then((data) => data ?? [])
        .catch(() => []),
    ])
      .then(([suggestions, sent]) => {
        if (cancelled) return;
        // Once a request is sent, the backend stops returning that person from
        // /connections/suggestions on the next fetch. Without this merge they'd
        // vanish from the page entirely instead of showing as already requested.
        const suggestionIds = new Set(suggestions.map((user) => user.id));
        const requestedUsers = sent
          .map((connection) => mapUser(connection.addressee))
          .filter((user) => !suggestionIds.has(user.id));
        setUsers([...suggestions, ...requestedUsers]);
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
  }, []);

  return { users, loading, error };
}
