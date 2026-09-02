import { useState } from "react";
import { AcademicTab } from "./AcademicTab";
import { ProfessionalTab } from "./ProfessionalTab";
import type { AcademicProfileDto } from "../../../services/userService";

type TabKey = "academic" | "professional";

const TABS: { key: TabKey; label: string }[] = [
  { key: "academic", label: "Dados Acadêmicos" },
  { key: "professional", label: "Profissional" },
];

export function ProfileTabs({
  academicProfiles,
  currentPosition,
}: {
  academicProfiles: AcademicProfileDto[];
  currentPosition?: string;
}) {
  const [activeTab, setActiveTab] = useState<TabKey>("academic");

  return (
    <section className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="flex gap-2 border-b border-gray-100 mb-4">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors ${
              activeTab === tab.key
                ? "border-dark-green text-dark-green"
                : "border-transparent text-gray-400 hover:text-dark-green"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "academic" ? (
        <AcademicTab academicProfiles={academicProfiles} />
      ) : (
        <ProfessionalTab currentPosition={currentPosition} />
      )}
    </section>
  );
}
