export function NewsListItemCard({ news, onViewMore }) {
  return (
    <article className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
      <img src={news.coverImage} alt={news.title} className="w-full h-40 object-cover" />

      <div className="p-4 flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-gray-900 text-base leading-snug line-clamp-2">
          {news.title}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-3 flex-1">{news.description}</p>

        <div className="flex items-center justify-between mt-2">
          <span className="text-gray-400 text-xs">{news.publishedAt}</span>
          <button
            onClick={onViewMore}
            className="bg-green text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-green-800 transition-colors cursor-pointer"
          >
            Ver mais
          </button>
        </div>
      </div>
    </article>
  );
}
