// pages/AdminNewsForm/AdminNewsForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon, X, CalendarCheck } from "lucide-react";
import { DayPicker } from "@daypicker/react";
import "@daypicker/react/style.css";
import { toast, Toaster } from "sonner";
import { Typography } from "../../components/Typography/Typography.jsx";
import { InputField } from "../../components/InputField/InputField.jsx";
import { Textarea } from "../../components/Textarea/Textarea.jsx";
import { mockNews } from "../../mocks/mockNews.js";

export function AdminNewsForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = !!id;

  const [cover, setCover] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  useEffect(() => {
    if (isEditing) {
      const news = mockNews.find((n) => n.id === Number(id));
      if (news) {
        setCoverPreview(news.coverImage);
        setTitle(news.title);
        setContent(news.description);
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
    const formattedDate = selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" });
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

  return (
    <div className="font-poppins max-w-4xl mx-auto">
      <Toaster position="top-center" richColors />
      {/* Título */}
      <Typography variant="h1">
        {isEditing ? "Editar notícia" : "Nova notícia"}
      </Typography>

      <div className="mt-8 bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-5">
        {/* Upload de capa */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
          <div className="w-full h-72 rounded-2xl bg-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-300 transition-colors overflow-hidden">
            {coverPreview ? (
              <img
                src={coverPreview}
                alt="Capa"
                className="w-full h-full object-cover"
              />
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
          {/* Toolbar inferior */}
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
      <div className="mt-8 flex items-center justify-end gap-4">
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
        <button
          onClick={handlePublish}
          className="bg-dark-green text-white font-semibold px-6 py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer"
        >
          Publicar
        </button>
      </div>

      {/* Modal de agendamento */}
      {scheduleOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setScheduleOpen(false)}
          />

          {/* Card do modal */}
          <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col items-center gap-4 min-w-[340px]">
            {/* Header */}
            <div className="flex items-center justify-between w-full">
              <span className="font-semibold text-dark-green text-lg">Agendar publicação</span>
              <button
                onClick={() => setScheduleOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </div>

            {/* Calendário */}
            <DayPicker
              animate
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={{ before: new Date() }}
              classNames={{
                root: "font-poppins",
                months: "flex flex-col",
                month: "space-y-3",
                caption: "flex justify-center items-center relative",
                caption_label: "text-dark-green font-semibold text-base capitalize",
                nav: "flex items-center gap-2",
                nav_button: "text-dark-green hover:opacity-70 transition-opacity cursor-pointer",
                nav_button_previous: "absolute left-0",
                nav_button_next: "absolute right-0",
                table: "w-full border-collapse",
                head_row: "flex",
                head_cell: "text-gray-400 text-xs font-medium w-9 text-center",
                row: "flex w-full mt-1",
                cell: "w-9 h-9 text-center text-sm relative",
                day: "w-9 h-9 rounded-full hover:bg-gray-100 transition-colors cursor-pointer font-medium",
                day_selected: "bg-dark-green text-white hover:bg-dark-green rounded-full",
                day_today: "text-blue-500 font-bold",
                day_disabled: "text-gray-300 cursor-not-allowed hover:bg-transparent",
                day_outside: "text-gray-300",
              }}
            />

            {/* Data selecionada */}
            {selectedDate && (
              <div className="flex items-center gap-2 text-sm text-dark-green font-medium bg-green-50 px-4 py-2 rounded-lg w-full justify-center">
                <CalendarCheck size={16} />
                <span>Publicar em {selectedDate.toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })}</span>
              </div>
            )}

            {/* Botão confirmar */}
            <button
              onClick={handleConfirmSchedule}
              disabled={!selectedDate}
              className="w-full bg-dark-green text-white font-semibold py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Confirmar agendamento
            </button>
          </div>
        </div>
      )}
    </div>
  );
}