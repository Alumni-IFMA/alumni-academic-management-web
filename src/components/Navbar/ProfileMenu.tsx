import { User, Shield, LogOut } from "lucide-react";

function LinkedinIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.56V9h3.554v11.452z" />
    </svg>
  );
}

const MENU_ITEMS = [
  { icon: User, label: "Ver Perfil" },
  { icon: LinkedinIcon, label: "Linkedin" },
  { icon: Shield, label: "Privacidade" },
];

export function ProfileMenu({
  userName,
  avatarSrc,
  onLogout,
}: {
  userName: string | null;
  avatarSrc: string;
  onLogout: () => void;
}) {
  return (
    <div className="absolute right-0 top-full mt-3 w-96 bg-dark-green text-white rounded-2xl shadow-lg p-5 z-50">
      <div className="flex items-center gap-3 min-w-0 mb-4">
        <img src={avatarSrc} alt="Foto de perfil" className="h-11 w-11 rounded-full object-cover shrink-0" />
        <span className="font-semibold truncate">Olá, {userName}</span>
      </div>

      <div className="grid grid-cols-3 gap-x-2 gap-y-3 text-sm mb-4">
        {MENU_ITEMS.map(({ icon: Icon, label }) => (
          <button
            key={label}
            className="flex items-center gap-1.5 text-left text-white/90 hover:text-white"
          >
            <Icon size={16} className="shrink-0" />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <button
        onClick={onLogout}
        className="flex items-center gap-2 text-sm text-white/90 hover:text-white"
      >
        <LogOut size={16} />
        Sair
      </button>
    </div>
  );
}
