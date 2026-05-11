// components/AdminHeader/AdminHeader.jsx
import lua from "../../assets/lua.png";
import sino from "../../assets/sino.png";
import kenia from "../../assets/kenia.png";

export function AdminHeader({ title }) {
  return (
    <header className="w-full h-[72px] bg-white border-b border-gray-100 flex items-center justify-between px-8 font-poppins shrink-0">
      {/* Título da página */}
      <span className="text-[32px] font-semibold text-dark-green">{title}</span>

      {/* Ações */}
      <div className="flex items-center gap-4">
        <div>
          <button className="rounded-full hover:bg-gray-100 p-1 transition-colors cursor-pointer">
            <img src={lua} alt="Alternar tema" className="h-8 w-8" />
          </button>
          <button className="relative rounded-full hover:bg-gray-100 p-1 transition-colors cursor-pointer">
            <img src={sino} alt="Notificações" className="h-8 w-8" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>
        </div>
        <button className="rounded-full overflow-hidden h-10 w-10 border-2 border-dark-green cursor-pointer">
          <img
            src={kenia}
            alt="Foto de perfil"
            className="h-full w-full object-cover"
          />
        </button>
      </div>
    </header>
  );
}
