// pages/AdminNewsForm/AdminNewsForm.jsx
import { useState, useEffect, type ChangeEvent, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon, Trash2, ArrowLeft, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

import { Typography } from "../../components/Typography/Typography";
import { InputField } from "../../components/InputField/InputField";
import { Textarea } from "../../components/Textarea/Textarea";
import { DeleteModal } from "../../components/DeleteModal/DeleteModal";
import { ScheduleModal } from "../../components/ScheduleModal/ScheduleModal";

import { getNewsById, createNews, updateNews, deleteNews } from "../../services/newsService";
import { buildNewsFormData } from "./buildNewsFormData";
import { deriveNewsStatus, type NewsStatus } from "../../utils/newsStatus";

export function AdminNewsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [submitting, setSubmitting] = useState(false);
  const [cover, setCover] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null | undefined>(null);
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState<NewsStatus | null>(null);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const isPublished = status === "published";

  useEffect(() => {
    if (!id) return;

    getNewsById(id)
      .then((news) => {
        setCoverPreview(news.coverImageUrl);
        setTitle(news.title);
        setSummary(news.summary ?? "");
        setContent(news.content ?? "");
        setStatus(deriveNewsStatus({ draft: news.draft, publishedAt: news.publishedAt }));
      })
      .catch(() => {
        toast.error("Não foi possível carregar a notícia.");
        navigate("/admin/news");
      })
      .finally(() => setLoading(false));
  }, [id, navigate]);

  function handleCoverChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCover(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  async function submitNews({
    draft,
    publishedAt,
    successMessage,
    successStyle,
  }: {
    draft: boolean;
    publishedAt: Date | null;
    successMessage: string;
    successStyle?: CSSProperties;
  }) {
    setSubmitting(true);
    try {
      const formData = buildNewsFormData({ title, summary, content, draft, publishedAt, coverFile: cover });
      if (isEditing) {
        await updateNews(id, formData);
      } else {
        await createNews(formData);
      }
      toast.success(successMessage, successStyle ? { style: successStyle } : undefined);
      navigate("/admin/news");
    } catch {
      toast.error("Não foi possível salvar a notícia.");
    } finally {
      setSubmitting(false);
    }
  }

  function handleSaveDraft() {
    submitNews({ draft: true, publishedAt: null, successMessage: "Rascunho salvo com sucesso!" });
  }

  function handleConfirmSchedule() {
    if (!selectedDate) return;
    const formattedDate = selectedDate.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
    submitNews({
      draft: false,
      publishedAt: selectedDate,
      successMessage: `Notícia agendada para ${formattedDate}!`,
      successStyle: { background: "#3b82f6", color: "white" },
    });
    setScheduleOpen(false);
    setSelectedDate(undefined);
  }

  function handlePublish() {
    submitNews({
      draft: false,
      publishedAt: null,
      successMessage: "Notícia publicada com sucesso!",
      successStyle: { background: "#166534", color: "white" },
    });
  }

  async function handleConfirmDelete() {
    if (!id) return;
    setSubmitting(true);
    try {
      await deleteNews(id);
      toast.error("Notícia excluída com sucesso!");
      setDeleteOpen(false);
      navigate("/admin/news");
    } catch {
      toast.error("Não foi possível excluir a notícia.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="mt-16 flex flex-col items-center text-gray-400">
        <Loader2 size={32} className="animate-spin mb-3" />
        <p className="text-base">Carregando notícia...</p>
      </div>
    );
  }

  return (
    <div className="font-poppins max-w-4xl mx-auto">
      <Toaster position="top-center" richColors />

      <button
        onClick={() => navigate("/admin/news")}
        className="flex items-center gap-2 text-dark-green hover:opacity-70 transition-opacity cursor-pointer mb-4"
      >
        <ArrowLeft size={20} />
        <span className="font-medium text-xl">Voltar</span>
      </button>

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

        {/* Resumo */}
        <InputField
          placeholder="Resumo (opcional)"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
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
      <div className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {isEditing && (
          <button
            onClick={() => setDeleteOpen(true)}
            disabled={submitting}
            className="flex items-center justify-center gap-2 text-red-500 border border-red-400 px-6 py-3 rounded-xl hover:bg-red-50 transition-colors cursor-pointer font-semibold disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Trash2 size={18} />
            Excluir
          </button>
        )}

        <div className={`flex flex-wrap items-center gap-4 ${isEditing ? "sm:justify-end" : "sm:ml-auto"}`}>
          {!isPublished && (
            <>
              <button
                onClick={handleSaveDraft}
                disabled={submitting}
                className="bg-yellow-400 text-white font-semibold px-6 py-3 rounded-xl hover:bg-yellow-500 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Salvar Rascunho
              </button>
              <button
                onClick={() => setScheduleOpen(true)}
                disabled={submitting}
                className="bg-blue-500 text-white font-semibold px-6 py-3 rounded-xl hover:bg-blue-600 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Agendar
              </button>
            </>
          )}
          <button
            onClick={handlePublish}
            disabled={submitting}
            className="bg-dark-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {submitting ? "Salvando..." : "Publicar"}
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
  );
}
