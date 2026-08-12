import { useEffect, useState } from "react";
import { toast } from "sonner";
import userService from "../../../services/userService";
import { useConnection } from "../../../hooks/useConnection";
import { SuggestionCard } from "./SuggestionCard";

export function SearchResults({ query, onClear }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { connect, statusFor } = useConnection();

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    userService.search(query)
      .then((data) => {
        if (!cancelled) setResults(data);
      })
      .catch((err) => {
        const message = err.response?.data?.message ?? "Erro ao buscar usuários.";
        if (!cancelled) setError(message);
        toast.error(message);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [query]);

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-dark-green">
          Resultados para "{query}"
        </h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-dark-green underline-offset-2 hover:underline"
        >
          Limpar busca
        </button>
      </div>

      {error && (
        <p className="mb-4 text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
        </div>
      ) : results.length === 0 ? (
        <p className="text-center text-sm text-gray-400">
          Nenhum perfil encontrado para essa busca.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((user) => (
            <SuggestionCard
              key={user.id}
              user={user}
              status={statusFor(user.id)}
              onConnect={connect}
              showConnect={!user.connected}
            />
          ))}
        </div>
      )}
    </section>
  );
}