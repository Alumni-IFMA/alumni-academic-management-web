import api from "./api";
import type { AcademicProfileDto } from "./userService";

export interface UserProfileResponseDto {
  id: number;
  name: string;
  email: string;
  bio?: string | null;
  profilePictureUrl?: string | null;
  linkedinUrl?: string | null;
  portfolioUrl?: string | null;
  currentPosition?: string | null;
  accountStatus: string;
  role: string;
  hasSeenTutorial: boolean;
  academicProfiles: AcademicProfileDto[];
}

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  bio?: string;
  avatarUrl: string | null;
  linkedinUrl?: string;
  portfolioUrl?: string;
  currentPosition?: string;
  academicProfiles: AcademicProfileDto[];
}

export function mapProfile(dto: UserProfileResponseDto): UserProfile {
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    bio: dto.bio ?? undefined,
    avatarUrl: dto.profilePictureUrl || null,
    linkedinUrl: dto.linkedinUrl ?? undefined,
    portfolioUrl: dto.portfolioUrl ?? undefined,
    currentPosition: dto.currentPosition ?? undefined,
    academicProfiles: dto.academicProfiles,
  };
}

/** GET /auth/users/{id}/profile */
async function getProfile(id: number): Promise<UserProfile> {
  const { data } = await api.get<UserProfileResponseDto>(`/auth/users/${id}/profile`);
  return mapProfile(data);
}

export default { getProfile };
