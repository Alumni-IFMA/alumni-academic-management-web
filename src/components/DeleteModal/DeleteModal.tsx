// components/DeleteModal/DeleteModal.jsx
import { X } from "lucide-react";

export function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 min-w-[340px]">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-lg">Excluir notícia</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>
        <p className="text-gray-500 text-sm">
          Tem certeza que deseja excluir esta notícia? Essa ação não pode ser desfeita.
        </p>
        <div className="flex gap-3 mt-2">
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 text-gray-600 font-semibold py-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 bg-green text-white font-semibold py-3 rounded-xl hover:bg-green-600 transition-colors cursor-pointer"
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  );
}
