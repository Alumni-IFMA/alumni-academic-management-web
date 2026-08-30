import { Link } from "react-router-dom";
import { ConnectButton } from "../../../components/ConnectButton/ConnectButton";
import type { NetworkUser } from "../../../services/userService";
import type { ConnectStatus } from "../../../hooks/useConnection";
import { getAvatarForUser } from "../avatarFallback";

export function HighlightCard({
  user,
  status,
  onConnect,
}: {
  user: NetworkUser;
  status: ConnectStatus;
  onConnect: (userId: number) => void;
}) {
  const avatar = user.avatarUrl || getAvatarForUser(user.id);

  return (
    <div className="relative h-90 w-60 shrink-0 overflow-hidden rounded-2xl shadow-md snap-start">
      <img src={avatar} alt={user.name} className="h-full w-full object-cover" loading="lazy" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />

      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-2 p-3">
        <div>
          <p className="font-semibold leading-tight text-white">{user.name}</p>
          {user.subtitle && <p className="text-xs text-white/85">{user.subtitle}</p>}
        </div>
        <div className="flex items-center gap-2">
          <ConnectButton status={status} onClick={() => onConnect(user.id)} />
          <Link
            to={`/perfil/${user.id}`}
            className="rounded-full bg-white/90 px-4 py-1.5 text-sm font-medium text-dark-green hover:bg-white whitespace-nowrap"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
