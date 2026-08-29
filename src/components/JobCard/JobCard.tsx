import { Bookmark } from "lucide-react";
import { MapPin, Clock } from "lucide-react";

export interface JobCardData {
  id: number;
  companyLogo?: string | null;
  companyName: string;
  title: string;
  location: string;
  postedAt: string;
  description?: string;
  tags: string[];
}

export function JobCard({
  job,
  isSelected = false,
  onClick,
}: {
  job: JobCardData;
  isSelected?: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl p-5 cursor-pointer flex flex-col gap-3 border-2 transition-all duration-200 ${
        isSelected ? "border-dark-green shadow-lg" : "border-transparent shadow-md"
      }`}
    >
      {/* Topo: empresa + bookmark */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-11 w-11 rounded-md bg-gray-200 overflow-hidden">
            <img
              src={job.companyLogo ?? undefined}
              alt={job.companyName}
              className="h-full w-full object-cover"
            />
          </div>
          <span className="text-sm font-medium text-gray-700">{job.companyName}</span>
        </div>
        <button
          onClick={(e) => e.stopPropagation()}
          className="text-gray-400 hover:text-dark-green"
        >
          <Bookmark size={18} />
        </button>
      </div>

      {/* Título */}
      <h2 className="text-lg font-bold text-gray-900">{job.title}</h2>

      {/* Localização e tempo */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {job.postedAt}
        </span>
      </div>

      {/* Descrição */}
      <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>

      {/* Tags + Botão */}
      <div className="flex items-center justify-between mt-1">
        <div className="flex gap-2">
          {job.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs rounded-full bg-light-green text-dark-green font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="bg-green text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
          Candidatar-se
        </button>
      </div>
    </div>
  );
}
