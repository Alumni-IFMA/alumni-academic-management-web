// components/StatusBadge/StatusBadge.jsx
import type { NewsStatus } from "../../utils/newsStatus";

const statusConfig: Record<NewsStatus, { label: string; className: string }> = {
  published: {
    label: "Publicado",
    className: "bg-green text-white",
  },
  scheduled: {
    label: "Agendado",
    className: "bg-blue-500 text-white",
  },
  draft: {
    label: "Rascunho",
    className: "bg-yellow-400 text-white",
  },
};

export function StatusBadge({ status }: { status: NewsStatus }) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <span
      className={`px-3 py-1 rounded-tl-xl rounded-br-xl text-sm font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}
