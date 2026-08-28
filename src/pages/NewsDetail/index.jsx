import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import DOMPurify from "dompurify";
import { Typography } from "../../components/Typography/Typography";
import { getNewsById } from "../../services/newsService";
import { mapNewsDetail } from "./mapNewsDetail";

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [news, setNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getNewsById(id)
      .then((dto) => {
        if (!cancelled) setNews(mapNewsDetail(dto));
      })
      .catch(() => {
        if (!cancelled) setLoadError("Não foi possível carregar a notícia.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-8 pb-16">
      <button
        onClick={() => navigate(-1)}
        aria-label="Voltar"
        className="mt-4 flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition-colors cursor-pointer"
      >
        <ArrowLeft size={22} className="text-dark-green" />
      </button>

      {loading && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-base">Carregando notícia...</p>
        </div>
      )}

      {!loading && loadError && (
        <div className="mt-16 flex flex-col items-center text-gray-400">
          <p className="text-base">{loadError}</p>
        </div>
      )}

      {!loading && !loadError && news && (
        <article className="mt-4 bg-white rounded-3xl shadow-sm p-6 sm:p-10">
          <img
            src={news.coverImage}
            alt={news.title}
            className="w-full max-h-[420px] object-cover rounded-2xl"
          />

          <div className="mt-8 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-2">
            <Typography variant="h1" className="!text-3xl sm:!text-4xl">
              {news.title}
            </Typography>
            <span className="text-gray-400 text-sm shrink-0">
              Publicado em {news.publishedAt}
            </span>
          </div>

          <div
            className="mt-6 text-gray-700 leading-relaxed whitespace-pre-wrap"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(news.content) }}
          />
        </article>
      )}
    </div>
  );
}
