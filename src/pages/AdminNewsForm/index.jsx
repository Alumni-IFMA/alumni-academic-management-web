// pages/AdminNewsForm/AdminNewsForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon, Trash2, ArrowLeft } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Typography } from "../../components/Typography/Typography.jsx";
import { InputField } from "../../components/InputField/InputField.jsx";
import { Textarea } from "../../components/Textarea/Textarea.jsx";
import { DeleteModal } from "../../components/DeleteModal/DeleteModal.jsx";
import { ScheduleModal } from "../../components/ScheduleModal/ScheduleModal.jsx";

import { mockNews } from "../../mocks/mockNews.js";

export function AdminNewsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isPublished = status === "published";

  useEffect(() => {
    if (isEditing) {
      const news = mockNews.find((n) => n.id === Number(id));
      if (news) {
        setCoverPreview(news.coverImage);
        setTitle(news.title);
        setContent(news.description);
        setStatus(news.status);
      }
    }
  }, [id]);

  function handleCoverChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function handleSaveDraft() {
    toast.warning("Rascunho salvo com sucesso!");
  }

  function handleConfirmSchedule() {
    if (!selectedDate) return;
    const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    toast.success(`Notícia agendada para ${formattedDate}!`, {
      style: { background: "#3b82f6", color: "white" },
    });
    setScheduleOpen(false);
    setSelectedDate(null);
  }

  function handlePublish() {
    toast.success("Notícia publicada com sucesso!", {
      style: { background: "#166534", color: "white" },
    });
  }

  function handleConfirmDelete() {
    toast.error("Notícia excluída com sucesso!");
    setDeleteOpen(false);
    navigate("/admin/news");
  }

  return (
    <>
       <button
        onClick={() => navigate("/admin/news")}
        className="flex items-center gap-2 text-dark-green hover:opacity-70 transition-opacity cursor-pointer mb-4"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-xl">Voltar</span>
      </button>

      <div className="font-poppins max-w-4xl mx-auto">
      <Toaster position="top-center" richColors />

      <Typography variant="h1">
        {isEditing ? "Editar notícia" : "Nova notícia"}
      </Typography>

      <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-5">
        {/* Upload de capa */}
        <label className="cursor-pointer">
          <input type="file" accept="image/*" className="hidden" onChange={handleCoverChange} />
          <div className="w-full h-72 rounded-2xl bg-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-300 transition-colors overflow-hidden">
            {coverPreview ? (
              <img src={coverPreview} alt="Capa" className="w-full h-full object-cover" />
            ) : (
              <>
                <ImageIcon size={52} className="text-dark-green" strokeWidth={1.5} />
                <span className="text-dark-green font-semibold text-base">Capa</span>
              </>
            )}
          </div>
        </label>

        {/* Título */}
        <InputField
          placeholder="Titulo"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {/* Matéria */}
        <div className="border border-dark-green rounded-lg overflow-hidden">
          <Textarea
            placeholder="Matéria"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="border-0 rounded-none min-h-56"
          />
          <div className="flex items-center gap-3 px-6 py-3 border-t border-dark-green bg-white">
            <label className="cursor-pointer text-dark-green hover:opacity-70 transition-opacity">
              <input type="file" accept="image/*" className="hidden" />
              <ImageIcon size={20} strokeWidth={1.5} />
            </label>
            <span className="text-dark-green font-bold text-lg leading-none">+</span>
          </div>
        </div>
      </div>

      {/* Botões */}
      <div className="mt-8 flex items-center justify-between gap-4">
        {isEditing ? (
          <button
            onClick={() => setDeleteOpen(true)}
            className="flex items-center gap-2 text-red-500 border border-red-400 px-6 py-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer font-semibold"
          >
            <Trash2 size={18} />
            Excluir
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-4">
          {!isPublished && (
            <>
              <button
                onClick={handleSaveDraft}
                className="bg-yellow-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors cursor-pointer"
              >
                Salvar Rascunho
              </button>
              <button
                onClick={() => setScheduleOpen(true)}
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Agendar
              </button>
            </>
          )}
          <button
            onClick={handlePublish}
            className="bg-dark-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer"
          >
            Publicar
          </button>
        </div>
      </div>

      <ScheduleModal
        isOpen={scheduleOpen}
        onClose={() => setScheduleOpen(false)}
        onConfirm={handleConfirmSchedule}
        selectedDate={selectedDate}
        onSelectDate={setSelectedDate}
      />

      <DeleteModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleConfirmDelete}
      />
    </div>
    </>
  );
}