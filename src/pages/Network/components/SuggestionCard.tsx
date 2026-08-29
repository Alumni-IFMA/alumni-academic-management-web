import { Link } from "react-router-dom";
import { ConnectButton } from "../../../components/ConnectButton/ConnectButton";
import { Typography } from "../../../components/Typography/Typography";
import type { NetworkUser } from "../../../services/userService";
import type { ConnectStatus } from "../../../hooks/useConnection";

import avatar1 from "../../../assets/images/avatar1.svg";
import avatar2 from "../../../assets/images/avatar2.svg";
import avatar3 from "../../../assets/images/avatar3.svg";
import avatar4 from "../../../assets/images/avatar4.svg";
import avatar5 from "../../../assets/images/avatar5.svg";

const AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5];

function getAvatar(userId: number) {
  const index = userId % AVATARS.length;
  return AVATARS[index];
}

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
  const avatar = user.avatarUrl || getAvatar(user.id);

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
          <p className="truncate text-xs text-gray-500">{user.role}</p>
          <p className="truncate text-xs text-gray-400">
            {[user.company, user.location].filter(Boolean).join(" · ")}
          </p>
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
