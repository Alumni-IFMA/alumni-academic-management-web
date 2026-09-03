import type { AcademicProfileDto } from "../../../services/userService";

function findSharedProfile(own: AcademicProfileDto[], other: AcademicProfileDto[]): AcademicProfileDto | null {
  for (const ownProfile of own) {
    const match = other.find(
      (otherProfile) =>
        otherProfile.campusName === ownProfile.campusName && otherProfile.courseName === ownProfile.courseName
    );
    if (match) return match;
  }
  return null;
}

export function ConnectionBanner({ own, other }: { own: AcademicProfileDto[]; other: AcademicProfileDto[] }) {
  const shared = findSharedProfile(own, other);
  if (!shared) return null;

  return (
    <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-dark-green">
      <span className="font-medium">
        Mesmo curso e campus: {shared.courseName} · {shared.campusName}
      </span>
    </div>
  );
}
