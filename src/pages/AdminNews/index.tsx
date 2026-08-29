// pages/AdminNews/AdminNews.jsx
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Newspaper, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { NewsCard } from "../../components/NewsCard/NewsCard";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Typography } from "../../components/Typography/Typography";
import { getAdminNews, deleteNews } from "../../services/newsService";
import { mapAdminNews, type AdminNewsItem } from "./mapAdminNews";
import type { NewsStatus } from "../../utils/newsStatus";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const statusFilters = [
  { id: "all", name: "Todas" },
  { id: "published", name: "Publicado" },
  { id: "scheduled", name: "Agendado" },
  { id: "draft", name: "Rascunho" },
];

export function AdminNews() {
  const navigate = useNavigate();
  const [news, setNews] = useState<AdminNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | NewsStatus>("all");

  const debouncedSearch = useDebouncedValue(search, 400);

  useEffect(() => {
    setLoading(true);
    setError(false);

    getAdminNews()
      .then((data) => {
        const items = Array.isArray(data) ? data : (data?.content ?? []);
        setNews(items.map(mapAdminNews));
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filteredNews = news.filter((item) => {
    const matchesSearch = item.title.toLowerCase().includes(debouncedSearch.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  function handleEdit(id: number) {
    navigate(`/admin/news/edit/${id}`);
  }

  async function handleDelete(id: number) {
    try {
      await deleteNews(id);
      setNews((prev) => prev.filter((item) => item.id !== id));
      toast.error("Notícia excluída com sucesso!");
    } catch {
      toast.error("Não foi possível excluir a notícia.");
    }
  }

  return (
    <div className="font-poppins">
      <Toaster position="top-center" richColors />
      {/* Título */}
      <Typography variant="h1">Notícias</Typography>

      {/* Barra de ações */}
      <div className="mt-6 flex items-center gap-4">
        <SearchBar
          className="flex-1"
          placeholder="Mentores, egressos e professores"
          value={search}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          onSearch={() => {}}
        />
        <Dropdown
          className="w-48 rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          items={statusFilters}
          defaultValue="all"
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setStatusFilter(e.target.value as "all" | NewsStatus)
          }
        />
        <button
          onClick={() => navigate("/admin/news/new")}
          className="flex items-center gap-2 bg-green text-white px-6 py-4 rounded-xl font-medium text-base hover:bg-green-800 transition-colors shrink-0 cursor-pointer"
        >
          <Plus size={18} />
          Nova Notícia
        </button>
      </div>

      {loading && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-base">Carregando notícias...</p>
        </div>
      )}

      {!loading && error && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <p className="text-base">Não foi possível carregar as notícias.</p>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Newspaper size={48} className="mb-3 opacity-40" />
          <p className="text-base">Nenhuma notícia cadastrada ainda.</p>
        </div>
      )}

      {!loading && !error && news.length > 0 && (
        <>
          {/* Grid de notícias */}
          <div className="mt-8 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredNews.map((item) => (
              <NewsCard key={item.id} news={item} onEdit={handleEdit} onDelete={handleDelete} />
            ))}
          </div>

          {filteredNews.length === 0 && (
            <div className="mt-16 flex flex-col items-center text-gray-400">
              <Newspaper size={48} className="mb-3 opacity-40" />
              <p className="text-base">Nenhuma notícia encontrada.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
