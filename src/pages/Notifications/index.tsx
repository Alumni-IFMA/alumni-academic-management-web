import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import networkAlumni from "../../services/networkAlumni";
import { mapUser, type NetworkUser } from "../../services/userService";
import { getAvatarForUser } from "../Network/avatarFallback";

interface PendingRequest {
  connectionId: number;
  user: NetworkUser;
}

export function Notifications() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<PendingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    networkAlumni
      .getPendingRequests()
      .then((data) => {
        if (cancelled) return;
        setRequests(data.map((connection) => ({ connectionId: connection.id, user: mapUser(connection.requester) })));
      })
      .catch(() => {
        if (!cancelled) setLoadError("Não foi possível carregar as notificações.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  async function handleAccept(connectionId: number) {
    setActionError(null);
    try {
      await networkAlumni.acceptConnection(connectionId);
      setRequests((prev) => prev.filter((r) => r.connectionId !== connectionId));
    } catch {
      setActionError("Não foi possível aceitar a solicitação.");
    }
  }

  async function handleDecline(connectionId: number) {
    setActionError(null);
    try {
      await networkAlumni.declineConnection(connectionId);
      setRequests((prev) => prev.filter((r) => r.connectionId !== connectionId));
    } catch {
      setActionError("Não foi possível recusar a solicitação.");
    }
  }

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => navigate(-1)}
          aria-label="Voltar"
          className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer -ml-2"
        >
          <ArrowLeft size={22} className="text-dark-green" />
        </button>
        <h1 className="text-3xl font-bold text-dark-green">Notificações</h1>
      </div>

      {loading && <p className="text-sm text-gray-400">Carregando notificações...</p>}
      {!loading && loadError && <p className="text-sm text-red-600">{loadError}</p>}
      {actionError && <p className="text-sm text-red-600 mb-4">{actionError}</p>}

      {!loading && !loadError && requests.length === 0 && (
        <p className="text-sm text-gray-400">Nenhuma solicitação de conexão pendente.</p>
      )}

      {!loading && !loadError && requests.length > 0 && (
        <ul className="flex flex-col gap-3">
          {requests.map(({ connectionId, user }) => {
            const avatar = user.avatarUrl || getAvatarForUser(user.id);
            return (
              <li key={connectionId} className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <img src={avatar} alt={user.name} className="h-12 w-12 rounded-full object-cover shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-dark-green truncate">{user.name}</p>
                  {user.subtitle && <p className="text-sm text-gray-500 truncate">{user.subtitle}</p>}
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleAccept(connectionId)}
                    className="bg-green text-white text-sm font-medium px-4 py-1.5 rounded-full hover:opacity-90"
                  >
                    Aceitar
                  </button>
                  <button
                    onClick={() => handleDecline(connectionId)}
                    className="border border-gray-300 text-gray-600 text-sm font-medium px-4 py-1.5 rounded-full hover:bg-gray-50"
                  >
                    Recusar
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
