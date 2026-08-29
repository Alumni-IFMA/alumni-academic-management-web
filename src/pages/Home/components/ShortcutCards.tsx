import { useNavigate } from "react-router-dom";
import { Users, MessageCircle, BookOpen, Download, type LucideIcon } from "lucide-react";

type CardAction = { type: "navigate"; to: string } | { type: "external"; href: string };

interface Card {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  action: CardAction;
}

const CARDS: Card[] = [
  {
    icon: Users,
    title: "Rede Alumni",
    subtitle: "Encontre colegas e mentores",
    action: { type: "navigate", to: "/network" },
  },
  {
    icon: MessageCircle,
    title: "Feedback",
    subtitle: "Avalie seu curso",
    action: { type: "external", href: "https://forms.google.com" },
  },
  {
    icon: BookOpen,
    title: "Biblioteca A+",
    subtitle: "Encontre colegas e mentores",
    action: { type: "external", href: "https://suap.ifma.edu.br/" },
  },
  {
    icon: Download,
    title: "Diploma",
    subtitle: "Baixe seu diploma virtual",
    action: { type: "navigate", to: "/diploma" },
  },
];

export function ShortcutCards() {
  const navigate = useNavigate();

  function handleClick(action: CardAction) {
    if (action.type === "navigate") {
      navigate(action.to);
    } else {
      window.open(action.href, "_blank", "noopener,noreferrer");
    }
  }

  return (
    <section className="pb-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {CARDS.map(({ icon: Icon, title, subtitle, action }) => (
          <button
            key={title}
            onClick={() => handleClick(action)}
            className="flex items-center gap-4 bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-green transition-all text-left"
          >
            <div className="shrink-0 h-12 w-12 rounded-full bg-light-green flex items-center justify-center text-dark-green">
              <Icon size={24} strokeWidth={1.5} />
            </div>
            <div>
              <p className="text-sm font-bold text-dark-green">{title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{subtitle}</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}
