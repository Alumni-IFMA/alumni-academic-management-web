// pages/AdminNewsForm/AdminNewsForm.jsx
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ImageIcon } from "lucide-react";
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
    console.log("Salvar rascunho", { cover, title, content });
  }

  function handleSchedule() {
    console.log("Agendar", { cover, title, content });
  }

  function handlePublish() {
    console.log("Publicar", { cover, title, content });
  }

  return (
    <div className="font-poppins max-w-4xl mx-auto">

      <div className="bg-white rounded-2xl p-8 shadow-sm flex flex-col gap-5">
        {/* Título */}
        <Typography variant="h1">
            {isEditing ? "Editar notícia" : "Nova notícia"}
        </Typography>
        {/* Upload de capa */}
        <label className="cursor-pointer">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleCoverChange}
          />
          <div className="w-full rounded-2xl bg-gray-200 flex flex-col items-center justify-center gap-2 hover:bg-gray-300 transition-colors overflow-hidden">
  {coverPreview ? (
    <img
      src={coverPreview}
      alt="Capa"
      className="w-full h-auto"
    />
  ) : (
    <div className="h-52 w-full flex flex-col items-center justify-center gap-2">
      <ImageIcon size={52} className="text-dark-green" strokeWidth={1.5} />
      <span className="text-dark-green font-semibold text-base">Capa</span>
    </div>
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
          onClick={handleSchedule}
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
    </div>
  );
}