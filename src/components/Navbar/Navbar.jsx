import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import lua from "../../assets/lua.png";
import sino from "../../assets/sino.png";
import alumni from "../../assets/alumni-ifma.png";
import kenia from "../../assets/kenia.png";

const navLinks = [
  { to: "/home", label: "Início" },
  { to: "/network", label: "Rede" },
  { to: "/opportunities", label: "Oportunidades" },
  { to: "/news", label: "Notícias" },
  { to: "/contact", label: "Fale conosco" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-[95%] mx-auto mt-7 px-6 py-3 border border-gray-200 bg-white rounded-3xl shadow-lg">
      <div className="flex items-center justify-between h-[70px]">
        {/* Logo */}
        <div className="flex items-center gap-2 shrink-0">
          <img src={alumni} alt="Logo Alumni IFMA" className="h-10 w-auto" />
        </div>

        {/* Nav — desktop */}
        <nav className="hidden md:flex items-center gap-2">
          {navLinks.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green text-white"
                    : "text-gray-600 hover:text-dark-green"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex gap-2">
            <button className="p-1 rounded-full hover:bg-gray-100">
              <img src={lua} alt="Alternar tema" className="h-9 w-9" />
            </button>
            <button className="relative p-1 rounded-full hover:bg-gray-100">
              <img src={sino} alt="Notificações" className="h-9 w-9" />
              <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
            </button>
          </div>
          <button className="rounded-full overflow-hidden h-11 w-11 border-2 border-green shrink-0">
            <img src={kenia} alt="Foto de perfil" className="h-full w-full object-cover" />
          </button>
          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-1 rounded-md hover:bg-gray-100"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Abrir menu"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile nav drawer */}
      {menuOpen && (
        <nav className="md:hidden flex flex-col gap-1 pb-4 pt-2 border-t border-gray-100 mt-2">
          {navLinks.map(({ to, label }) => {
            const isActive = pathname === to;
            return (
              <Link
                key={to}
                to={to}
                onClick={() => setMenuOpen(false)}
                className={`px-4 py-2 rounded-full text-base font-medium transition-colors ${
                  isActive
                    ? "bg-green text-white"
                    : "text-gray-600 hover:text-dark-green"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>
      )}
    </header>
  );
}
