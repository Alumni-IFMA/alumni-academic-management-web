// pages/AdminNews/AdminNews.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { NewsCard } from "../../components/NewsCard/NewsCard.jsx";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { Dropdown } from "../../components/Dropdown/Dropdown.jsx";
import { Typography } from "../../components/Typography/Typography.jsx";

import mockCover1 from "../../assets/microsoft.png";
import mockCover2 from "../../assets/google.png";

const statusFilters = [
  { id: "all", name: "Todas" },
  { id: "published", name: "Publicado" },
  { id: "scheduled", name: "Agendado" },
  { id: "draft", name: "Rascunho" },
];

const mockNews = [
  {
    id: 1,
    title: "Seletivo Técnico – IFMA 2026",
    description:
      "Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do IFMA. Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do...",
    coverImage: mockCover1,
    status: "published",
    publishedAt: "25/11/2025",
  },
  {
    id: 2,
    title: "Seletivo Técnico – IFMA 2026",
    description:
      "Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do IFMA. Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do...",
    coverImage: mockCover2,
    status: "scheduled",
    publishedAt: "25/11/2025",
  },
  {
    id: 3,
    title: "Seletivo Técnico – IFMA 2026",
    description:
      "Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do IFMA. Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do...",
    coverImage: mockCover1,
    status: "draft",
    publishedAt: "25/11/2025",
  },
  {
    id: 4,
    title: "Seletivo Técnico – IFMA 2026",
    description:
      "Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do IFMA. Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do...",
    coverImage: mockCover2,
    status: "published",
    publishedAt: "25/11/2025",
  },
  {
    id: 5,
    title: "Seletivo Técnico – IFMA 2026",
    description:
      "Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do IFMA. Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do...",
    coverImage: mockCover1,
    status: "scheduled",
    publishedAt: "25/11/2025",
  },
  {
    id: 6,
    title: "Seletivo Técnico – IFMA 2026",
    description:
      "Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do IFMA. Inscrições abertas para novos alunos. Participe do processo seletivo e venha fazer parte do...",
    coverImage: mockCover2,
    status: "draft",
    publishedAt: "25/11/2025",
  },
];

export function AdminNews() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const filteredNews = mockNews.filter((news) => {
    const matchesSearch = news.title
      .toLowerCase()
      .includes(search.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || news.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleEdit(id) {
    navigate(`/admin/news/edit/${id}`);
  }

  return (
    <div className="font-poppins">
      {/* Título */}
      <Typography variant="h1">Notícias</Typography>

      {/* Barra de ações */}
      <div className="mt-6 flex items-center gap-4">
        <SearchBar
          className="flex-1"
          placeholder="Mentores, egressos e professores"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={() => {}}
        />
        <Dropdown
          className="w-[25%] rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          items={statusFilters}
          defaultValue="all"
          onChange={(value) => setStatusFilter(value)}
        />
        <button
          onClick={() => navigate("/admin/news/new")}
          className="flex items-center gap-2 bg-green text-white px-5 py-2.5 rounded-xl font-medium text-sm hover:bg-green-800 transition-colors shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          Nova Notícia
        </button>
      </div>

      {/* Grid de notícias */}
      <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNews.map((news) => (
          <NewsCard key={news.id} news={news} onEdit={handleEdit} />
        ))}
      </div>

      {filteredNews.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Newspaper size={48} className="mb-3 opacity-40" />
          <p className="text-base">Nenhuma notícia encontrada.</p>
        </div>
      )}
    </div>
  );
}