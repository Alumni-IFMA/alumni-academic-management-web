// components/NewsCard/NewsCard.jsx
import { useState } from "react";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";
import { StatusBadge } from "../StatusBadge/StatusBadge";
import { DeleteModal } from "../DeleteModal/DeleteModal";

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

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}