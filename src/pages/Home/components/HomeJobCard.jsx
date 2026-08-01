import { Heart, MapPin, Megaphone } from "lucide-react";

export function HomeJobCard({ job }) {
  return (
    <article className="bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">
          Tipo:&nbsp;{job.type}
        </span>
        <button aria-label="Salvar vaga" className="text-gray-400 hover:text-red-400 transition-colors">
          <Heart size={16} />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="h-11 w-11 rounded-xl bg-light-green flex items-center justify-center shrink-0">
          {job.companyLogo ? (
            <img
              src={job.companyLogo}
              alt={job.companyName}
              className="h-8 w-8 object-contain"
            />
          ) : (
            <Megaphone size={20} className="text-green" />
          )}
        </div>
        <div>
          <h3 className="font-bold text-gray-900 text-sm leading-tight">{job.title}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{job.companyName}</p>
        </div>
      </div>

      <div className="flex items-center gap-1 text-xs text-green">
        <MapPin size={12} />
        <span>{job.location}</span>
      </div>
    </article>
  );
}
