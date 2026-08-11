import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import networkAlumni from "../../../services/networkAlumni";
import { useConnection } from "../../../hooks/useConnection";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { SuggestionCard } from "./SuggestionCard";

export function SuggestionsGrid() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { connect, statusFor } = useConnection();

  const loadPage = useCallback((targetPage) => {
    setLoading(true);
    networkAlumni.getSuggestions({ page: targetPage })
      .then((data) => {
        setUsers((prev) =>
          targetPage === 0 ? data.content : [...prev, ...data.content]
        );
        setIsLast(data.last);
      })
      .catch((err) => {
        const message = err.response?.data?.message ?? "Erro ao carregar sugestões.";
        setError(message);
        toast.error(message);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadPage(0);
  }, [loadPage]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    loadPage(nextPage);
  }, [page, loadPage]);

  const sentinelRef = useInfiniteScroll({
    onIntersect: loadMore,
    enabled: !isLast && !loading && users.length > 0,
  });

  return (
    <section>
      <h2 className="text-2xl font-bold text-dark-green mb-4">
        Pessoas que você talvez conheça
      </h2>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <SuggestionCard
            key={user.id}
            user={user}
            status={statusFor(user.id)}
            onConnect={connect}
          />
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div
              key={`skeleton-${i}`}
              className="h-24 animate-pulse rounded-xl bg-gray-200"
            />
          ))}
      </div>

      {!isLast && <div ref={sentinelRef} className="h-1" aria-hidden="true" />}

      {isLast && users.length > 0 && (
        <p className="mt-6 text-center text-sm text-gray-400">
          Você viu todas as sugestões por enquanto.
        </p>
      )}

      {!loading && users.length === 0 && !error && (
        <p className="text-center text-sm text-gray-400">
          Nenhuma sugestão de conexão no momento.
        </p>
      )}
    </section>
  );
}