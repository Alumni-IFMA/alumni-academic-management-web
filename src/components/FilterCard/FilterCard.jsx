import { SlidersHorizontal, MapPin } from "lucide-react";
import { Dropdown } from "../Dropdown/Dropdown";
import computer from "../../assets/computer-icon.png";

const AREAS = [
  { id: "Tecnologia", name: "Tecnologia" },
  { id: "Design", name: "Design" },
  { id: "Marketing", name: "Marketing" },
  { id: "Dados", name: "Dados" },
  { id: "Produto", name: "Produto" },
  { id: "Vendas", name: "Vendas" },
];

const EXPERIENCE_LEVELS = [
  { id: "INTERNSHIP", label: "Estágio / Trainee" },
  { id: "JUNIOR", label: "Júnior" },
  { id: "MID", label: "Pleno" },
  { id: "SENIOR", label: "Sênior" },
];

export function FilterCard({
  hideTitle = false,
  location,
  onLocationChange,
  area,
  onAreaChange,
  experience,
  onExperienceToggle,
  remoteOnly,
  onRemoteOnlyChange,
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-[100%] flex flex-col gap-5">

      {/* Título */}
      {!hideTitle && (
        <div className="flex items-center gap-2">
          <SlidersHorizontal size={18} className="text-dark-green" />
          <span className="font-semibold text-lg">Filtros</span>
        </div>
      )}

      {/* Localização */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin size={14} /> Localização
        </label>
        <input
          type="text"
          placeholder="Cidade, estado ou remoto"
          value={location}
          onChange={(e) => onLocationChange(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
        />
      </div>

      {/* Área */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Área</label>
        <Dropdown
          items={AREAS}
          value={area}
          onChange={(e) => onAreaChange(e.target.value)}
          className="w-full h-10 border border-gray-300 rounded-lg text-base"
          size="sm"
        />
      </div>

      {/* Experiência */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600">Experiência</label>
        {EXPERIENCE_LEVELS.map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={experience.includes(id)}
              onChange={() => onExperienceToggle(id)}
              className="accent-dark-green w-4 h-4"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Apenas remoto */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer">
          <span><img src={computer} alt="Computador" className="w-6 h-6" /></span> Apenas remoto
        </label>
        <button
          onClick={() => onRemoteOnlyChange(!remoteOnly)}
          aria-label="Apenas remoto"
          className={`w-11 h-6 rounded-full transition-colors duration-300 ${
            remoteOnly ? "bg-dark-green" : "bg-gray-300"
          }`}
        >
          <span
            className={`block h-5 w-5 bg-white rounded-full shadow transition-transform duration-300 ${
              remoteOnly ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>

    </div>
  );
}
