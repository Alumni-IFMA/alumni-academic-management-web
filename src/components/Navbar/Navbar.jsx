import { Link, useLocation } from "react-router-dom";
import { Home, Network, Briefcase, Newspaper, MessageCircle } from "lucide-react";
import lua from "../../assets/lua.png";
import sino from "../../assets/sino.png";
import alumni from "../../assets/alumni-ifma.png";
import kenia from "../../assets/kenia.png";

const navLinks = [
  { to: "/", label: "Início", icon: Home },
  { to: "/network", label: "Rede", icon: Network },
  { to: "/opportunities", label: "Oportunidades", icon: Briefcase },
  { to: "/news", label: "Notícias", icon: Newspaper },
  { to: "/contact", label: "Fale Conosco", icon: MessageCircle },
];

export function Navbar() {
  const { pathname } = useLocation();

  return (
    <header className="w-[95%] h-[97px] mx-auto mt-7 flex items-center justify-between px-6 py-3 border border-gray-200 bg-white rounded-3xl shadow-lg">

      {/* Logo */}
      <div className="flex items-center gap-2">
        <img src={alumni} alt="Logo Alumni IFMA" className="h-10 w-auto" />
      </div>

      {/* Nav */}
      <nav className="flex items-center gap-8">
        {navLinks.map(({ to, label, icon: Icon }) => {
          const isActive = pathname === to;
          return (
            <Link
              key={to}
              to={to}
              className={`flex flex-col items-center text-lg hover:text-green-700 ${
                isActive ? "text-green-700 font-semibold" : "text-gray-600"
              }`}
            >
              <Icon size={20} />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-7">
        <div className="flex gap-2">
            <button className="rounded-full hover:bg-gray-100">
                <img src={lua} alt="Alternar tema" className="h-9 w-9" />
            </button>
            <button className="relative rounded-full hover:bg-gray-100">
                <img src={sino} alt="Notificações" className="h-9 w-9" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
        </div>
        <button className="rounded-full overflow-hidden h-12 w-12 border-2 border-green-700">
          <img src={kenia} alt="Foto de perfil" className="h-full w-full object-cover" />
        </button>
      </div>

    </header>
  );
}