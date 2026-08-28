import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Newspaper } from "lucide-react";
import { SearchBar } from "../../components/SearchBar/SearchBar";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Typography } from "../../components/Typography/Typography";
import { NewsListItemCard } from "./components/NewsListItemCard";
import { getNews } from "../../services/newsService";
import { mapNews } from "./mapNews";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const PAGE_SIZE = 9;
const DEBOUNCE_MS = 400;

const SORT_OPTIONS = [
  { id: "all", name: "Todas" },
  { id: "recent", name: "Mais recentes" },
];

const SORT_PARAMS = {
  all: undefined,
  recent: "publishedAt,desc",
};

function extractPage(data) {
  return {
    content: Array.isArray(data) ? data : (data?.content ?? []),
    last: Array.isArray(data) ? true : Boolean(data?.last),
  };
}

export function News() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("all");
  const debouncedSearch = useDebouncedValue(search, DEBOUNCE_MS);
  const sortParam = SORT_PARAMS[sort];

  const [news, setNews] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getNews({ page: 0, size: PAGE_SIZE, sort: sortParam })
      .then((data) => {
        if (cancelled) return;
        const { content, last } = extractPage(data);
        setNews(content.map(mapNews));
        setPage(0);
        setIsLastPage(last);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Não foi possível carregar as notícias.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [sortParam]);

  function handleLoadMore() {
    if (loadingMore || isLastPage) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    getNews({ page: nextPage, size: PAGE_SIZE, sort: sortParam })
      .then((data) => {
        const { content, last } = extractPage(data);
        setNews((prev) => [...prev, ...content.map(mapNews)]);
        setPage(nextPage);
        setIsLastPage(last);
      })
      .catch(() => setLoadError("Não foi possível carregar mais notícias."))
      .finally(() => setLoadingMore(false));
  }

  function handleSearch() {}

  // GET /news só aceita page/size/sort (confirmado no OpenAPI da API) — não
  // existe busca no servidor. A busca filtra localmente o que já foi
  // carregado, no mesmo padrão já usado pela AdminNews.
  const filteredNews = news.filter((item) =>
    item.title.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-16">
      <header className="space-y-1">
        <Typography variant="h1">Notícias</Typography>
        <Typography variant="p">
          Fique por dentro das novidades e conquistas da comunidade Alumni IFMA.
        </Typography>
      </header>

      <div className="mt-6 flex flex-col sm:flex-row gap-4 sm:items-center">
        <SearchBar
          className="sm:w-[65%]"
          placeholder="Procure por notícias"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <Dropdown
          className="sm:w-[35%] rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          items={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          size="lg"
        />
      </div>

      {loading && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-base">Carregando notícias...</p>
        </div>
      )}

      {!loading && loadError && news.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <p className="text-base">{loadError}</p>
        </div>
      )}

      {!loading && !loadError && news.length === 0 && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Newspaper size={48} className="mb-3 opacity-40" />
          <p className="text-base">Nenhuma notícia disponível no momento.</p>
        </div>
      )}

      {!loading && news.length > 0 && (
        <>
          {filteredNews.length === 0 ? (
            <div className="mt-16 flex flex-col items-center text-gray-400">
              <Newspaper size={48} className="mb-3 opacity-40" />
              <p className="text-base">Nenhuma notícia encontrada.</p>
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredNews.map((item) => (
                <NewsListItemCard
                  key={item.id}
                  news={item}
                  onViewMore={() => navigate(`/news/${item.id}`)}
                />
              ))}
            </div>
          )}

          {loadError && (
            <p className="mt-4 text-red-500 text-sm text-center">{loadError}</p>
          )}

          {!isLastPage && (
            <div className="mt-10 flex justify-center">
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                className="bg-green text-white font-semibold px-8 py-3 rounded-xl hover:bg-green-800 transition-colors cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loadingMore ? "Carregando..." : "Carregar mais notícias"}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
