// components/Sidebar/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Users,
  Briefcase,
  Newspaper,
  FileBarChart2,
  Handshake,
  Settings,
  LogOut,
} from "lucide-react";
import alumni from "../../assets/alumni-ifma.png";

const navLinks = [
  { to: "/admin", label: "Inicio", icon: Home },
  { to: "/admin/egressos", label: "Egressos", icon: Users },
  { to: "/admin/vagas", label: "Vagas", icon: Briefcase },
  { to: "/admin/news", label: "Notícias", icon: Newspaper },
  { to: "/admin/relatorios", label: "Relatórios", icon: FileBarChart2 },
  { to: "/admin/parceiros", label: "Parceiros", icon: Handshake },
  { to: "/admin/configuracoes", label: "Configurações", icon: Settings },
];

export function Sidebar() {
  const { pathname } = useLocation();

  return (
    <aside className="w-64 min-h-screen bg-green flex flex-col font-poppins shrink-0">
      {/* Logo */}
      <div className="flex items-center justify-center py-8 px-6">
        <img
          src={alumni}
          alt="Alumni IFMA"
          className="h-14 w-auto brightness-0 invert"
        />
      </div>

      {/* Nav links */}
      <nav className="flex flex-col gap-1 px-4 flex-1">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive =
            to === "/admin"
              ? pathname === to
              : pathname === to || pathname.startsWith(to + "/");
          return (
            <Link
              key={to}
              to={to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-lg font-medium transition-colors ${
                isActive
                  ? "bg-white/20 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon size={22} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Sair */}
      <div className="px-4 pb-8">
        <button className="flex items-center gap-3 px-4 py-3 rounded-xl text-white/70 hover:bg-white/10 hover:text-white transition-colors text-sm font-medium w-full cursor-pointer">
          <LogOut size={18} />
          <span>Sair</span>
        </button>
      </div>
    </aside>
  );
}
