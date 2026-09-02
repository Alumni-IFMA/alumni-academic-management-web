// mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md
export const mockSkills = ["React", "TypeScript", "Node.js", "Figma", "Scrum"];

export const mockStats = [
  { label: "Conexões", value: 128 },
  { label: "Projetos", value: 6 },
  { label: "Publicações", value: 2 },
];

export const mockPhone = "(98) 99999-0000";

export const mockSocialLinks = {
  instagram: "https://instagram.com/alumni.ifma",
  github: "https://github.com/alumni-ifma",
};

export const mockYearsOfExperience = 3;

export const mockProjects = [
  "Sistema de gestão acadêmica",
  "App de mobilidade urbana",
  "Plataforma de mentoria para egressos",
];

export const mockResearches = [
  "Aplicações de IA na educação técnica",
  "Sustentabilidade em campi do IFMA",
];

export interface MockTrajectoryItem {
  id: number;
  type: "Iniciação Científica" | "Monitoria" | "Extensão";
  title: string;
  period: string;
}

export const mockAcademicTrajectory: MockTrajectoryItem[] = [
  { id: 1, type: "Iniciação Científica", title: "Estudo de algoritmos de recomendação", period: "2022-2023" },
  { id: 2, type: "Monitoria", title: "Monitoria de Estrutura de Dados", period: "2021" },
  { id: 3, type: "Extensão", title: "Projeto de inclusão digital", period: "2020-2021" },
];

export const mockTcc = {
  title: "Sistema de recomendação para egressos do IFMA",
  year: 2023,
};

export const mockMutualConnectionsCount = 5;
