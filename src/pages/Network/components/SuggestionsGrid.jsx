import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import networkAlumni from "../../../services/networkAlumni";
import { useConnection } from "../../../hooks/useConnection";
import { useInfiniteScroll } from "../../../hooks/useInfiniteScroll";
import { SuggestionCard } from "./SuggestionCard";
import { MOCK_SUGGESTIONS } from "../mocks/mocksUsers.js";
import { Typography } from "../../../components/Typography/Typography.jsx";

export function SuggestionsGrid() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(0);
  const [isLast, setIsLast] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { connect, statusFor } = useConnection();

  const loadPage = useCallback((targetPage) => {
  setLoading(true);
  networkAlumni
    .getSuggestions({ page: targetPage })
    .then((data) => {
      const content = Array.isArray(data) ? data : (data.content ?? []);
      const last = Array.isArray(data) ? true : (data.last ?? true);

      if (targetPage === 0 && content.length === 0) {
        // TODO: remover fallback quando houver dados reais de sugestões em produção
        setUsers(MOCK_SUGGESTIONS.content);
        setIsLast(MOCK_SUGGESTIONS.last);
      } else {
        setUsers((prev) =>
          targetPage === 0 ? content : [...prev, ...content],
        );
        setIsLast(last);
      }
    })
    .catch(() => {
      if (targetPage === 0) {
        setUsers(MOCK_SUGGESTIONS.content);
        setIsLast(MOCK_SUGGESTIONS.last);
      }
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
      <Typography variant="h2" className="mb-4">
        Pessoas que você talvez conheça
      </Typography>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
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
