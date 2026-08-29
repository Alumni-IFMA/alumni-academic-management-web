import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bookmark, MapPin, Megaphone } from "lucide-react";
import type { JobRawDto } from "../../../services/jobsService";

const WORKPLACE_TYPE_LABELS: Record<string, string> = {
  HYBRID: "Híbrido",
  REMOTE: "Remoto",
  ONSITE: "Presencial",
};

export function HomeJobCard({ job }: { job: JobRawDto }) {
  const workplaceLabel = WORKPLACE_TYPE_LABELS[job.workplaceType ?? ""] ?? job.workplaceType;
  const [logoFailed, setLogoFailed] = useState(false);
  const [saved, setSaved] = useState(false);
  const navigate = useNavigate();

  return (
    <article
      onClick={() => navigate("/opportunities")}
      className="bg-white border border-gray-200 border-l-4 border-l-green rounded-2xl p-4 shadow-sm flex flex-col gap-3 hover:shadow-md transition-shadow cursor-pointer"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">
          Tipo: <span className="font-medium text-gray-700">{workplaceLabel}</span>
        </p>
        <button
          aria-label="Salvar vaga"
          onClick={(e) => {
            e.stopPropagation();
            setSaved((v) => !v);
          }}
          className={`transition-colors ${saved ? "text-green" : "text-gray-400 hover:text-dark-green"}`}
        >
          <Bookmark size={16} fill={saved ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-light-green flex items-center justify-center shrink-0 overflow-hidden">
          {job.companyLogoUrl && !logoFailed ? (
            <img
              src={job.companyLogoUrl}
              alt={job.company}
              className="h-full w-full object-cover"
              onError={() => setLogoFailed(true)}
            />
          ) : (
            <Megaphone size={22} className="text-dark-green" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-gray-900 text-sm leading-tight truncate">{job.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5 truncate">{job.company}</p>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-gray-500 border-t border-gray-100 pt-2">
        <MapPin size={12} className="text-green shrink-0" />
        <span className="truncate">{job.location}</span>
      </div>
    </article>
  );
}
