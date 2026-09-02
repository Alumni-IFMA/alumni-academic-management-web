import type { AcademicProfileDto } from "../../../services/userService";

export function ConnectionBanner({
  own,
  other,
  mutualConnectionsCount,
}: {
  own: AcademicProfileDto[];
  other: AcademicProfileDto[];
  mutualConnectionsCount: number;
}) {
  const ownProfile = own[0];
  const otherProfile = other[0];
  const sameCourseAndCampus =
    !!ownProfile &&
    !!otherProfile &&
    ownProfile.campusName === otherProfile.campusName &&
    ownProfile.courseName === otherProfile.courseName;

  return (
    <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3 flex flex-col gap-1 text-sm text-dark-green">
      {sameCourseAndCampus && (
        <span className="font-medium">
          Mesmo curso e campus: {otherProfile!.courseName} · {otherProfile!.campusName}
        </span>
      )}
      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <span className="text-dark-green/80">{mutualConnectionsCount} conexões em comum</span>
    </div>
  );
}
