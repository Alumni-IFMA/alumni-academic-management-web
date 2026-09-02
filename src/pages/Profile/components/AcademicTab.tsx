import { AcademicTrajectory } from "./AcademicTrajectory";
import { TccCard } from "./TccCard";
import type { AcademicProfileDto } from "../../../services/userService";

const LEVEL_LABEL: Record<string, string> = { TECNICO: "Técnico", GRADUACAO: "Graduação" };
const MODALITY_LABEL: Record<string, string> = {
  INTEGRADO: "Integrado",
  CONCOMITANTE: "Concomitante",
  SUBSEQUENTE: "Subsequente",
  BACHARELADO: "Bacharelado",
  LICENCIATURA: "Licenciatura",
};

export function AcademicTab({ academicProfiles }: { academicProfiles: AcademicProfileDto[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        {academicProfiles.length === 0 && (
          <p className="text-sm text-gray-400">Nenhum dado acadêmico cadastrado.</p>
        )}
        {academicProfiles.map((academicProfile) => (
          <div key={academicProfile.id} className="rounded-xl border border-gray-100 p-4">
            <p className="font-semibold text-dark-green">{academicProfile.courseName}</p>
            <p className="text-sm text-gray-500">
              {academicProfile.campusName} · {LEVEL_LABEL[academicProfile.level] ?? academicProfile.level} ·{" "}
              {MODALITY_LABEL[academicProfile.modality] ?? academicProfile.modality}
            </p>
            <p className="text-sm text-gray-400">
              {academicProfile.entryYear} — {academicProfile.conclusionYear}
            </p>
          </div>
        ))}
      </div>

      <AcademicTrajectory />
      <TccCard />
    </div>
  );
}
