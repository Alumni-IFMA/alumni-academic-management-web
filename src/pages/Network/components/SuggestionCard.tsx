import { Link } from "react-router-dom";
import { ConnectButton } from "../../../components/ConnectButton/ConnectButton";
import { Typography } from "../../../components/Typography/Typography";
import type { NetworkUser } from "../../../services/userService";
import type { ConnectStatus } from "../../../hooks/useConnection";
import { getAvatarForUser } from "../avatarFallback";

export function SuggestionCard({
  user,
  status,
  onConnect,
  showConnect = true,
}: {
  user: NetworkUser;
  status: ConnectStatus;
  onConnect: (userId: number) => void;
  showConnect?: boolean;
}) {
  const avatar = user.avatarUrl || getAvatarForUser(user.id);

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm">
      <div className="flex items-center gap-3">
        <img
          src={avatar}
          alt={user.name}
          className="h-20 w-20 shrink-0 rounded-full object-cover bg-gray-100"
          loading="lazy"
        />
        <div className="min-w-0 flex-1">
          <Typography variant="h3" className="truncate">
            {user.name}
          </Typography>
          {user.subtitle && <p className="truncate text-xs text-gray-500">{user.subtitle}</p>}
          {user.meta && <p className="truncate text-xs text-gray-400">{user.meta}</p>}
        </div>
      </div>

      <div className="mt-3 flex items-center gap-2 justify-center">
        {showConnect && (
          <ConnectButton
            status={status}
            onClick={() => onConnect(user.id)}
            className="px-18"
          />
        )}
        <Link
          to={`/perfil/${user.id}`}
          className="rounded-full bg-white border border-dark-green px-8 py-1.5 text-sm font-medium text-dark-green hover:bg-gray-50 whitespace-nowrap"
        >
          Ver perfil
        </Link>
      </div>
    </div>
  );
}
