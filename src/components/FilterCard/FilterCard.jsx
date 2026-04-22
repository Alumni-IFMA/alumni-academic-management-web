import { useState } from "react";
import { SlidersHorizontal, MapPin } from "lucide-react";
import { Dropdown } from "../Dropdown/Dropdown.jsx";
import computer from "../../assets/computer-icon.png";

const areas = [
  { id: "software", name: "Engenharia de software" },
  { id: "design", name: "Design" },
  { id: "marketing", name: "Marketing" },
  { id: "data", name: "Dados" },
];

const experienceLevels = [
  { id: "internship", label: "Estágio / Trainee" },
  { id: "junior", label: "Júnior" },
  { id: "mid", label: "Pleno" },
  { id: "senior", label: "Sênior" },
];

export function FilterCard() {
  const [location, setLocation] = useState("");
  const [experience, setExperience] = useState([]);
  const [salary, setSalary] = useState(6000);
  const [remoteOnly, setRemoteOnly] = useState(false);

  function toggleExperience(id) {
    setExperience((prev) =>
      prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 w-[500px] flex flex-col gap-5">

      {/* Título */}
      <div className="flex items-center gap-2">
        <SlidersHorizontal size={18} className="text-dark-green" />
        <span className="font-semibold text-lg">Filtros</span>
      </div>

      {/* Localização */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600 flex items-center gap-1">
          <MapPin size={14} /> Localização
        </label>
        <input
          type="text"
          placeholder="Cidade, estado ou remoto"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-full"
        />
      </div>

      {/* Área */}
      <div className="flex flex-col gap-1">
        <label className="text-sm text-gray-600">Área</label>
        <Dropdown items={areas} defaultValue="software" className="w-full h-10 border border-gray-300 rounded-lg text-base" size="sm" />
      </div>

      {/* Experiência */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600">Experiência</label>
        {experienceLevels.map(({ id, label }) => (
          <label key={id} className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="checkbox"
              checked={experience.includes(id)}
              onChange={() => toggleExperience(id)}
              className="accent-dark-green w-4 h-4"
            />
            {label}
          </label>
        ))}
      </div>

      {/* Salário */}
      <div className="flex flex-col gap-2">
        <label className="text-sm text-gray-600">Salário (mínimo, em R$)</label>
        <input
          type="range"
          min={0}
          max={20000}
          step={500}
          value={salary}
          onChange={(e) => setSalary(Number(e.target.value))}
          className="accent-dark-green w-full"
        />
        <span className="text-sm text-gray-500">R$ {salary.toLocaleString("pt-BR")}+</span>
      </div>

      {/* Apenas remoto */}
      <div className="flex items-center justify-between">
        <label className="text-sm text-gray-600 flex items-center gap-2 cursor-pointer">
          <span><img src={computer} alt="Computador" className="w-6 h-6" /></span> Apenas remoto
        </label>
        <button
          onClick={() => setRemoteOnly((prev) => !prev)}
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