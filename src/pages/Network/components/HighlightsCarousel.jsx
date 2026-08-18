import { useEffect, useState } from "react";
import userService from "../../../services/userService";
import { useConnection } from "../../../hooks/useConnection";
import { HighlightCard } from "./HighlightCard";
import { MOCK_HIGHLIGHTS } from "../mocks/mocksUsers.js";
import { Typography } from "../../../components/Typography/Typography.jsx";

export function HighlightsCarousel() {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { connect, statusFor } = useConnection();

  useEffect(() => {
    let cancelled = false; // Variável de controle para evitar atualizações de estado após o componente ser desmontado

    userService
      .getHighlights()
      .then((data) => {
        if (!cancelled) setHighlights(data);
      })
      .catch(() => {
        // TODO: remover fallback quando o CORS de produção for corrigido
        if (!cancelled) setHighlights(MOCK_HIGHLIGHTS);
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
      <Typography variant="h2" className="text-center mb-5">
        Destaques
      </Typography>

      {error && <p className="text-center text-sm text-red-600">{error}</p>}

      {loading ? (
        <div className="flex gap-4 overflow-hidden -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-16 lg:px-16">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={`h-72 w-48 shrink-0 rounded-2xl bg-gray-200 animate-pulse ${i % 2 === 1 ? "mt-6" : ""}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto snap-x pb-2 -mx-4 px-4 sm:-mx-8 sm:px-8 lg:-mx-16 lg:px-16">
          {highlights.map((user, index) => (
            <div key={user.id} className={index % 2 === 1 ? "mt-6" : ""}>
              <HighlightCard
                user={user}
                status={statusFor(user.id)}
                onConnect={connect}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
