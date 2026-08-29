import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HomeNewsCard } from "./HomeNewsCard";
import { getLatestNews, type NewsRawDto } from "../../../services/newsService";

type NewsResponse = NewsRawDto[] | { news?: NewsRawDto[]; content?: NewsRawDto[]; data?: NewsRawDto[] };

export function NewsSection() {
  const [news, setNews] = useState<NewsRawDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getLatestNews()
      .then((data) => {
        const payload = data as unknown as NewsResponse;
        setNews(Array.isArray(payload) ? payload : (payload?.news ?? payload?.content ?? payload?.data ?? []));
      })
      .catch(() => setError("Não foi possível carregar as notícias."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="h-full bg-white rounded-3xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-2xl font-bold text-dark-green">Notícias</h2>
        <Link to="/news" className="text-sm font-semibold text-green hover:underline">
          Ver todas
        </Link>
      </div>

      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <p className="text-red-500 text-sm">{error}</p>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {news.map((item) => (
            <HomeNewsCard key={item.id} news={item} />
          ))}
        </div>
      )}
    </section>
  );
}
