import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ProfileMenu } from "./ProfileMenu";
import profileService from "../../services/profileService";
import networkAlumni from "../../services/networkAlumni";
import { getAvatarForUser } from "../../pages/Network/avatarFallback";
import sino from "../../assets/sino.png";
import alumni from "../../assets/alumni-ifma.png";
import kenia from "../../assets/kenia.png";

const navLinks = [
  { to: "/home", label: "Início" },
  { to: "/rede", label: "Rede" },
  { to: "/opportunities", label: "Oportunidades" },
  { to: "/news", label: "Notícias" },
  { to: "/contact", label: "Fale conosco" },
];

export function Navbar() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { userName, userId, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [hasNotifications, setHasNotifications] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const lastScrollY = useRef(0);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userId == null) return;
    let cancelled = false;

    profileService
      .getProfile(userId)
      .then((profile) => {
        if (!cancelled) setAvatarUrl(profile.avatarUrl);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const avatarSrc = avatarUrl || (userId != null ? getAvatarForUser(userId) : kenia);

  useEffect(() => {
    let cancelled = false;

    networkAlumni
      .getPendingRequests()
      .then((data) => {
        if (!cancelled) setHasNotifications(data.length > 0);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    lastScrollY.current = window.scrollY;

    function handleScroll() {
      const currentY = window.scrollY;
      const scrolledDown = currentY > lastScrollY.current;
      setHidden(scrolledDown && currentY > 80);
      lastScrollY.current = currentY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!profileOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [profileOpen]);

  function handleLogout() {
    logout();
    setProfileOpen(false);
    navigate("/auth/login");
  }

  function handleNavigate(path: string) {
    setProfileOpen(false);
    navigate(path);
  }

  return (
    <header
      className={`fixed top-3 left-0 right-0 z-50 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 border border-gray-200 bg-white/70 backdrop-blur-md rounded-3xl shadow-lg transition-transform duration-300 ease-in-out ${
        hidden && !menuOpen ? "-translate-y-[calc(100%_+_2rem)]" : "translate-y-0"
      }`}
    >
      <div className="flex items-center justify-between h-[56px]">
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
            <button
              onClick={() => navigate("/notificacoes")}
              className="relative p-1 rounded-full hover:bg-gray-100"
            >
              <img src={sino} alt="Notificações" className="h-9 w-9" />
              {hasNotifications && (
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
              )}
            </button>
          </div>
          <div className="relative shrink-0" ref={profileRef}>
            <button
              onClick={() => setProfileOpen((v) => !v)}
              aria-label="Abrir menu de perfil"
              className="rounded-full overflow-hidden h-11 w-11 border-2 border-green"
            >
              <img src={avatarSrc} alt="Foto de perfil" className="h-full w-full object-cover" />
            </button>
            {profileOpen && (
              <ProfileMenu
                userName={userName ?? "Usuário"}
                avatarSrc={avatarSrc}
                onLogout={handleLogout}
                onNavigate={handleNavigate}
              />
            )}
          </div>
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
