import { Link } from "react-router-dom";
import { ConnectButton } from "../../../components/ConnectButton/ConnectButton.jsx";

import avatar1 from "../../../assets/images/avatar1.svg";
import avatar2 from "../../../assets/images/avatar2.svg";
import avatar3 from "../../../assets/images/avatar3.svg";
import avatar4 from "../../../assets/images/avatar4.svg";
import avatar5 from "../../../assets/images/avatar5.svg";

const AVATARS = [avatar1, avatar2, avatar3, avatar4, avatar5];

function getAvatar(userId) {
  const index = userId % AVATARS.length;
  return AVATARS[index];
}

export function SuggestionCard({ user, status, onConnect, showConnect = true }) {
  const avatar = user.avatarUrl || getAvatar(user.id);

  return (
    <div className="flex items-center gap-3 rounded-xl bg-white p-3 shadow-sm">
      <img
        src={avatar}
        alt={user.name}
        className="h-12 w-12 shrink-0 rounded-full object-cover"
        loading="lazy"
      />
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-gray-900">{user.name}</p>
        <p className="truncate text-xs text-gray-500">{user.role}</p>
        <p className="truncate text-xs text-gray-400">
          {[user.company, user.location].filter(Boolean).join(" · ")}
        </p>
        <div className="mt-2 flex items-center gap-2">
          {showConnect && (
            <ConnectButton status={status} onClick={() => onConnect(user.id)} />
          )}
          <Link
            to={`/perfil/${user.id}`}
            className="rounded-full bg-white border border-dark-green px-4 py-1.5 text-sm font-medium text-dark-green hover:bg-gray-50"
          >
            Ver perfil
          </Link>
        </div>
      </div>
    </div>
  );
}