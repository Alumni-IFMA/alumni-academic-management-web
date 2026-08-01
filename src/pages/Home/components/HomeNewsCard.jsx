import { useNavigate } from "react-router-dom";

export function HomeNewsCard({ news }) {
  const navigate = useNavigate();

  return (
    <article className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <img
        src={news.coverImage}
        alt={news.title}
        className="w-full h-44 object-cover"
      />
      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-bold text-gray-900 text-base leading-snug">
          {news.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 flex-1">
          {news.description}
        </p>
        <button
          onClick={() => navigate(`/news/${news.id}`)}
          className="mt-3 w-full bg-dark-green text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-green transition-colors"
        >
          Ver mais
        </button>
      </div>
    </article>
  );
}
