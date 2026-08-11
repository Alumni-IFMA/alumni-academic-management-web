import { useEffect, useState } from "react";
import userService from "../../../services/userService";
import { useConnection } from "../../../hooks/useConnection";
import { HighlightCard } from "./HighlightCard";

export function HighlightsCarousel() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { connect, statusFor } = useConnection();

  useEffect(() => {
    let cancelled = false; // Variável de controle para evitar atualizações de estado após o componente ser desmontado

    userService.getHighlights()
      .then((data) => {
        if (!cancelled) setHighlights(data);
      })
      .catch((err) => {
        if (!cancelled) setError(err.response?.data?.message ?? "Erro ao carregar destaques."); // err.response?.data? padrão do axios o erro vem em err.response.data
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section>
      <h2 className="text-2xl font-bold text-dark-green text-center mb-4">
        Destaques
      </h2>

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}

      {loading ? (
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-72 w-48 shrink-0 rounded-2xl bg-gray-200 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto snap-x pb-2">
          {highlights.map((user) => (
            <HighlightCard
              key={user.id}
              user={user}
              status={statusFor(user.id)}
              onConnect={connect}
            />
          ))}
        </div>
      )}
    </section>
  );
}