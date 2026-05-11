// layouts/AdminLayout.jsx
import { Outlet, useLocation } from "react-router-dom";
import { Sidebar } from "../components/Sidebar/Sidebar.jsx";
import { AdminHeader } from "../components/AdminHeader/AdminHeader.jsx";

const pageTitles = {
  "/admin": "Administrador",
  "/admin/egressos": "Administrador",
  "/admin/vagas": "Administrador",
  "/admin/news": "Administrador",
  "/admin/news/new": "Administrador",
  "/admin/relatorios": "Administrador",
  "/admin/parceiros": "Administrador",
  "/admin/configuracoes": "Administrador",
};

export function AdminLayout() {
  const { pathname } = useLocation();
  const title = pageTitles[pathname] ?? "Administrador";

  return (
    <div className="flex h-screen font-poppins bg-gray-50">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <AdminHeader title={title} />
        <main className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}