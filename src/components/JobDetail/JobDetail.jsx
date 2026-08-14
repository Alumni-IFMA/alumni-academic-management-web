import { MapPin, Clock, Bookmark, Share2 } from "lucide-react";

export function JobDetail({ job, loading = false, error = null }) {
  if (loading) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Carregando detalhes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex items-center justify-center">
        <p className="text-gray-400 text-sm">Selecione uma vaga para ver os detalhes.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white rounded-2xl shadow-md p-6 flex flex-col gap-5 overflow-y-auto max-h-[70vh]">

      {/* Topo */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-md bg-gray-200 overflow-hidden">
            {job.companyLogo ? (
              <img src={job.companyLogo} alt={job.companyName} className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-gray-300" />
            )}
          </div>
          <span className="text-sm font-medium text-gray-700">{job.companyName}</span>
        </div>
        <div className="flex gap-2">
          <button className="text-gray-400 hover:text-dark-green">
            <Share2 size={18} />
          </button>
          <button className="text-gray-400 hover:text-dark-green">
            <Bookmark size={18} />
          </button>
        </div>
      </div>

      {/* Título */}
      <h2 className="text-2xl font-bold text-gray-900">{job.title}</h2>

      {/* Localização e tempo */}
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span className="flex items-center gap-1">
          <MapPin size={14} /> {job.location}
        </span>
        <span className="flex items-center gap-1">
          <Clock size={14} /> {job.postedAt}
        </span>
      </div>

      {/* Tags + Botões */}
      <div className="flex items-center gap-3">
        {job.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 text-xs rounded-full border border-dark-green text-dark-green font-medium"
          >
            {tag}
          </span>
        ))}
        <button className="whitespace-nowrap bg-dark-green text-white text-sm font-semibold px-5 py-2 rounded-full hover:opacity-90 transition-opacity">
          Candidatar-se
        </button>
        <button className="flex items-center gap-2 border border-dark-green text-dark-green text-sm font-semibold px-5 py-2 rounded-full hover:bg-gray-50 transition-colors">
          <Bookmark size={14} /> Salvar
        </button>
      </div>

      <hr className="border-gray-100" />

      {/* Sobre a vaga */}
      <div className="flex flex-col gap-2">
        <h3 className="font-bold text-gray-900">Sobre a vaga</h3>
        <p className="text-sm text-gray-600 leading-relaxed">{job.description}</p>
      </div>

      {/* Requisitos */}
      {job.requirements && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-gray-900">Requisitos</h3>
          <ul className="list-disc list-inside text-sm text-gray-600 flex flex-col gap-1">
            {job.requirements.map((req) => (
              <li key={req}>{req}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Benefícios */}
      {job.benefits && (
        <div className="flex flex-col gap-2">
          <h3 className="font-bold text-gray-900">Benefícios</h3>
          <div className="flex flex-wrap gap-2">
            {job.benefits.map((benefit) => (
              <span
                key={benefit}
                className="px-3 py-1 text-xs rounded-full bg-green-100 text-dark-green font-medium"
              >
                {benefit}
              </span>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}