import type { NetworkUser } from "../../../services/userService";
import type { ConnectStatus } from "../../../hooks/useConnection";
import { SuggestionCard } from "./SuggestionCard";

export function SearchResults({
  query,
  users,
  statusFor,
  onConnect,
  onClear,
}: {
  query: string;
  users: NetworkUser[];
  statusFor: (userId: number) => ConnectStatus;
  onConnect: (userId: number) => void;
  onClear: () => void;
}) {
  const normalizedQuery = query.trim().toLowerCase();
  const results = users.filter((user) => user.name.toLowerCase().includes(normalizedQuery));

  return (
    <section>
      <div className="flex items-center justify-between mb-4 bg-page-bg/80 backdrop-blur-sm rounded-2xl px-4 py-2">
        <h2 className="text-2xl font-bold text-dark-green">Resultados para &quot;{query}&quot;</h2>
        <button
          type="button"
          onClick={onClear}
          className="text-sm font-medium text-dark-green underline-offset-2 hover:underline"
        >
          Limpar busca
        </button>
      </div>

      {results.length === 0 ? (
        <p className="text-center text-sm text-gray-400">Nenhum perfil encontrado para essa busca.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((user) => (
            <SuggestionCard
              key={user.id}
              user={user}
              status={statusFor(user.id)}
              onConnect={onConnect}
              showConnect={!user.connected}
            />
          ))}
        </div>
      )}
    </section>
  );
}
