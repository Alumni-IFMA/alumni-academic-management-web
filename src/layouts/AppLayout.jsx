import { Outlet, useLocation } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";
import { DecorativeRibbon } from "../pages/Home/components/DecorativeRibbon";

export function AppLayout() {
  const { pathname } = useLocation();
  const showRibbon = pathname === "/home";

  return (
    <div className="relative overflow-hidden min-h-screen flex flex-col bg-page-bg font-inter">
      {showRibbon && <DecorativeRibbon />}
      <Navbar />
      <main className="relative z-10 flex-1 pt-24">
        <Outlet />
      </main>
      <footer className="relative z-10 py-6 px-8 text-center text-sm text-gray-500">
        © 2026 Equipe alumni IFMA • Feito com carinho para a comunidade
      </footer>
    </div>
  );
}
