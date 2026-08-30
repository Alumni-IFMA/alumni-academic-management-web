import { useEffect, useState } from "react";
import networkAlumni from "../../../services/networkAlumni";
import type { NetworkUser } from "../../../services/userService";

export function useSuggestions(): { users: NetworkUser[]; loading: boolean; error: string | null } {
  const [users, setUsers] = useState<NetworkUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    networkAlumni
      .getSuggestions()
      .then((data) => {
        if (!cancelled) setUsers(data);
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
