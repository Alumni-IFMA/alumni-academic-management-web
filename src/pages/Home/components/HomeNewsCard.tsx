import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { NewsRawDto } from "../../../services/newsService";

export function HomeNewsCard({ news }: { news: NewsRawDto }) {
  const navigate = useNavigate();
  const [coverFailed, setCoverFailed] = useState(false);

  return (
    <article className="h-full bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col hover:shadow-md transition-shadow cursor-pointer">
      <div className="h-40 bg-gray-100 overflow-hidden">
        {news.coverImageUrl && !coverFailed ? (
          <img
            src={news.coverImageUrl}
            alt={news.title}
            className="w-full h-full object-cover"
            onError={() => setCoverFailed(true)}
          />
        ) : (
          <div className="w-full h-full bg-light-green" />
        )}
      </div>

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-3">
          {news.summary}
        </p>
        <button
          onClick={() => navigate(`/news/${news.id}`)}
          className="mt-auto w-full bg-dark-green text-white text-xs font-semibold py-2 rounded-xl hover:bg-green transition-colors"
        >
          Ver mais
        </button>
      </div>
    </article>
  );
}
