import { Link as LinkIcon, Phone, Mail } from "lucide-react";
import { Typography } from "../../../components/Typography/Typography";
import { Button } from "../../../components/Button/Button";
import { ConnectButton } from "../../../components/ConnectButton/ConnectButton";
import { getAvatarForUser } from "../../Network/avatarFallback";
import type { UserProfile } from "../../../services/profileService";
import type { ConnectStatus } from "../../../hooks/useConnection";
import { mockSkills, mockStats, mockPhone, mockSocialLinks } from "../mockProfileExtras";

const ACTION_BUTTON_CLASS = "!bg-white !text-dark-green hover:!bg-gray-100 w-full justify-center text-center";

function LinkedinIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.114 20.452H3.56V9h3.554v11.452z" />
    </svg>
  );
}

function InstagramIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function GithubIcon({ size = 16, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}

export function ProfileSidebar({
  profile,
  isOwnProfile,
  onEdit,
  connectStatus,
  onConnect,
}: {
  profile: UserProfile;
  isOwnProfile: boolean;
  onEdit: () => void;
  connectStatus: ConnectStatus;
  onConnect: () => void;
}) {
  const avatar = profile.avatarUrl || getAvatarForUser(profile.id);
  const mainAcademicProfile = profile.academicProfiles[0];

  return (
    <aside className="w-full lg:w-80 shrink-0 rounded-2xl bg-dark-green text-white p-6 flex flex-col items-center gap-4">
      <img src={avatar} alt={profile.name} className="h-28 w-28 rounded-full object-cover bg-white/10" />

      <div className="text-center">
        <Typography variant="h3" className="!text-white">
          {profile.name}
        </Typography>
        {profile.currentPosition && <p className="text-sm text-white/80">{profile.currentPosition}</p>}
        {mainAcademicProfile && (
          <p className="text-sm text-white/70">
            {mainAcademicProfile.courseName} · {mainAcademicProfile.entryYear}-{mainAcademicProfile.conclusionYear}
          </p>
        )}
      </div>

      {isOwnProfile ? (
        <Button variant="connect" onClick={onEdit} className={ACTION_BUTTON_CLASS}>
          Editar
        </Button>
      ) : (
        <ConnectButton status={connectStatus} onClick={onConnect} className={ACTION_BUTTON_CLASS} />
      )}

      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <div className="w-full flex flex-wrap gap-2 justify-center">
        {mockSkills.map((skill) => (
          <span key={skill} className="rounded-full bg-white/10 px-3 py-1 text-xs">
            {skill}
          </span>
        ))}
      </div>

      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <div className="w-full grid grid-cols-3 gap-2 text-center border-t border-white/10 pt-4">
        {mockStats.map((stat) => (
          <div key={stat.label}>
            <p className="font-semibold">{stat.value}</p>
            <p className="text-xs text-white/70">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col gap-2 border-t border-white/10 pt-4 text-sm">
        <span className="flex items-center gap-2 text-white/85">
          <Mail size={16} /> {profile.email}
        </span>
        {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
        <span className="flex items-center gap-2 text-white/85">
          <Phone size={16} /> {mockPhone}
        </span>
        {profile.linkedinUrl && (
          <a
            href={profile.linkedinUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-white/85 hover:text-white"
          >
            <LinkedinIcon size={16} /> LinkedIn
          </a>
        )}
        {profile.portfolioUrl && (
          <a
            href={profile.portfolioUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-white/85 hover:text-white"
          >
            <LinkIcon size={16} /> Portfólio
          </a>
        )}
        {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
        <a
          href={mockSocialLinks.instagram}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-white/85 hover:text-white"
        >
          <InstagramIcon size={16} /> Instagram
        </a>
        <a
          href={mockSocialLinks.github}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 text-white/85 hover:text-white"
        >
          <GithubIcon size={16} /> GitHub
        </a>
      </div>
    </aside>
  );
}
