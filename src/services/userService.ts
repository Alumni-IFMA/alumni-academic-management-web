import api from "./api";

export interface NetworkUser {
  id: number;
  name: string;
  subtitle?: string;
  meta?: string;
  avatarUrl?: string | null;
  connected?: boolean;
}

export interface AcademicProfileDto {
  id: number;
  entryYear: number;
  conclusionYear: number;
  campusName: string;
  courseName: string;
  level: string;
  modality: string;
}

export interface UserSimpleDto {
  id: number;
  name: string;
  email: string;
  academicProfiles?: AcademicProfileDto[];
  status: string;
  role: string;
}

export interface RegisterPayload {
  name: string;
  cpf: string;
  email: string;
  campusCourseId: number;
  entryYear: number;
  conclusionYear: number;
}

export function mapUser(dto: UserSimpleDto): NetworkUser {
  const profile = dto.academicProfiles?.[0];
  return {
    id: dto.id,
    name: dto.name,
    subtitle: profile?.courseName,
    meta: profile ? `${profile.campusName} · ${profile.entryYear}-${profile.conclusionYear}` : undefined,
    avatarUrl: null,
  };
}

/** POST /auth/register */
async function register(payload: RegisterPayload): Promise<unknown> {
  const { data } = await api.post("/auth/register", payload);
  return data;
}

export default { register };
