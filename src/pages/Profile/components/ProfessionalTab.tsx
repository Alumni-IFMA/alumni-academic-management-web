import { mockYearsOfExperience, mockProjects, mockResearches } from "../mockProfileExtras";

export function ProfessionalTab({ currentPosition }: { currentPosition?: string }) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="font-semibold text-dark-green">Cargo atual</p>
        <p className="text-sm text-gray-500">{currentPosition || "Não informado"}</p>
      </div>

      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <div>
        <p className="font-semibold text-dark-green">Anos de experiência</p>
        <p className="text-sm text-gray-500">{mockYearsOfExperience} anos</p>
      </div>

      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <div>
        <p className="font-semibold text-dark-green mb-2">Projetos</p>
        <ul className="list-disc list-inside text-sm text-gray-600 flex flex-col gap-1">
          {mockProjects.map((project) => (
            <li key={project}>{project}</li>
          ))}
        </ul>
      </div>

      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <div>
        <p className="font-semibold text-dark-green mb-2">Pesquisas</p>
        <ul className="list-disc list-inside text-sm text-gray-600 flex flex-col gap-1">
          {mockResearches.map((research) => (
            <li key={research}>{research}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
