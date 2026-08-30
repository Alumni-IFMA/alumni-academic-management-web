import type { NetworkUser } from "../../../services/userService";
import type { ConnectStatus } from "../../../hooks/useConnection";
import { SuggestionCard } from "./SuggestionCard";
import { Typography } from "../../../components/Typography/Typography";

export function SuggestionsGrid({
  users,
  loading,
  error,
  statusFor,
  onConnect,
}: {
  users: NetworkUser[];
  loading: boolean;
  error: string | null;
  statusFor: (userId: number) => ConnectStatus;
  onConnect: (userId: number) => void;
}) {
  return (
    <section>
      <Typography variant="h2" className="mb-4">
        Pessoas que você talvez conheça
      </Typography>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}

      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {users.map((user) => (
          <SuggestionCard key={user.id} user={user} status={statusFor(user.id)} onConnect={onConnect} />
        ))}

        {loading &&
          Array.from({ length: 3 }).map((_, i) => (
            <div key={`skeleton-${i}`} className="h-24 animate-pulse rounded-xl bg-gray-200" />
          ))}
      </div>

      {!loading && users.length === 0 && !error && (
        <p className="text-center text-sm text-gray-400">Nenhuma sugestão de conexão no momento.</p>
      )}
    </section>
  );
}
