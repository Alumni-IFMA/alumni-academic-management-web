// components/StatusBadge/StatusBadge.jsx

const statusConfig = {
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

export function StatusBadge({ status }) {
  const config = statusConfig[status] ?? statusConfig.draft;

  return (
    <span
      className={`px-3 py-1 rounded-tl-xl rounded-br-xl text-sm font-semibold ${config.className}`}
    >
      {config.label}
    </span>
  );
}