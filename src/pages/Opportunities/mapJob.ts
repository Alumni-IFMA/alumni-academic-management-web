import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { JobRawDto } from "../../services/jobsService";

export interface Job {
  id: number;
  companyName: string;
  companyLogo?: string | null;
  title: string;
  location: string;
  postedAt: string;
  description?: string;
  tags: string[];
  requirements: string[];
  benefits: string[];
}

const WORKPLACE_LABELS: Record<string, string> = {
  REMOTE: "Remoto",
  HYBRID: "Híbrido",
  ON_SITE: "Presencial",
};

const EXPERIENCE_LABELS: Record<string, string> = {
  INTERNSHIP: "Estágio",
  JUNIOR: "Júnior",
  MID: "Pleno",
  SENIOR: "Sênior",
};

function toDate(createdAt?: number[] | null): Date | null {
  if (!Array.isArray(createdAt)) return null;
  const [year, month, day, hour = 0, minute = 0, second = 0, nano = 0] = createdAt;
  return new Date(year, month - 1, day, hour, minute, second, Math.floor(nano / 1e6));
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function mapJob(dto: JobRawDto): Job {
  const date = toDate(dto.createdAt);

  return {
    id: dto.id,
    companyName: dto.company,
    companyLogo: dto.companyLogoUrl,
    title: dto.title,
    location: dto.location,
    postedAt: date ? capitalize(formatDistanceToNow(date, { locale: ptBR, addSuffix: true })) : "",
    description: dto.description,
    tags: [WORKPLACE_LABELS[dto.workplaceType ?? ""], EXPERIENCE_LABELS[dto.experienceLevel ?? ""]].filter(
      (tag): tag is string => Boolean(tag)
    ),
    requirements: dto.requirements ?? [],
    benefits: dto.benefits ?? [],
  };
}
