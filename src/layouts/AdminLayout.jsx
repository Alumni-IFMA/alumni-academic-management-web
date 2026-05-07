// layouts/AdminLayout.jsx
export function AdminLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <AdminHeader />
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />   {/* aqui renderiza a página */}
        </main>
      </div>
    </div>
  );
}