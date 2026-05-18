// components/NewsCard/NewsCard.jsx
import { useState } from "react";
import { Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "../StatusBadge/StatusBadge.jsx";

export function NewsCard({ news, onEdit, onDelete }) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  function handleConfirmDelete() {
    onDelete?.(news.id);
    setDeleteOpen(false);
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
        {/* Imagem com badge */}
        <div className="relative">
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full h-40 object-cover"
          />
          <div className="absolute top-0 left-0">
            <StatusBadge status={news.status} />
          </div>
          {/* Ícone lixeira */}
          <button
            onClick={() => setDeleteOpen(true)}
            className="absolute top-2 right-2 bg-white/80 hover:bg-white text-dark-green p-1.5 rounded-full transition-colors cursor-pointer shadow"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Conteúdo */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
            {news.title}
          </h3>
          <p className="text-gray-500 text-sm line-clamp-3 flex-1">
            {news.description}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-400 text-xs">{news.publishedAt}</span>
            <button
              onClick={() => onEdit(news.id)}
              className="bg-green text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-800 transition-colors cursor-pointer"
            >
              Editar
            </button>
          </div>
        </div>
      </div>

      {/* Modal de exclusão */}
      {deleteOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDeleteOpen(false)} />
          <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 min-w-[340px]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900 text-lg">Excluir notícia</span>
              <button onClick={() => setDeleteOpen(false)} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
                <X size={20} />
              </button>
            </div>
            <p className="text-gray-500 text-sm">
              Tem certeza que deseja excluir esta notícia? Essa ação não pode ser desfeita.
            </p>
            <div className="flex gap-3 mt-2">
              <button
                onClick={() => setDeleteOpen(false)}
                className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-dark-green text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}