import { Outlet } from "react-router-dom";
import { Navbar } from "../components/Navbar/Navbar";

export function AppLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-white font-inter">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="py-6 px-8 text-center text-sm text-gray-500">
        © 2026 Equipe alumni IFMA • Feito com carinho para a comunidade
      </footer>
    </div>
  );
}
