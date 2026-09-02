import { mockAcademicTrajectory } from "../mockProfileExtras";

export function AcademicTrajectory() {
  return (
    <div>
      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <p className="font-semibold text-dark-green mb-2">Trajetória acadêmica</p>
      <ul className="flex flex-col gap-2">
        {mockAcademicTrajectory.map((item) => (
          <li key={item.id} className="rounded-lg border border-gray-100 p-3">
            <p className="text-sm font-medium text-dark-green">{item.type}</p>
            <p className="text-sm text-gray-600">{item.title}</p>
            <p className="text-xs text-gray-400">{item.period}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
