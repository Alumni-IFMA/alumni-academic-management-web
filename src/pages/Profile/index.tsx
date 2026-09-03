import { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useConnection } from "../../hooks/useConnection";
import profileService, { type UserProfile } from "../../services/profileService";
import { ProfileSidebar } from "./components/ProfileSidebar";
import { AboutSection } from "./components/AboutSection";
import { ProfileTabs } from "./components/ProfileTabs";
import { EditProfileModal } from "./components/EditProfileModal";
import { ConnectionBanner } from "./components/ConnectionBanner";

export function Profile() {
  const { id: idParam } = useParams();
  const { userId } = useAuth();
  const { connect, statusFor } = useConnection();

  const [ownProfile, setOwnProfile] = useState<UserProfile | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const invalidId = idParam !== undefined && Number.isNaN(Number(idParam));
  const targetId = idParam !== undefined ? Number(idParam) : userId;
  const isOwnProfile = targetId === userId;

  useEffect(() => {
    if (invalidId || targetId == null) return;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    profileService
      .getProfile(targetId)
      .then((data) => {
        if (cancelled) return;
        setProfile(data);
        if (isOwnProfile) setOwnProfile(data);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Não foi possível carregar este perfil.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [invalidId, targetId, isOwnProfile]);

  useEffect(() => {
    if (invalidId || isOwnProfile || userId == null) return;
    let cancelled = false;

    profileService
      .getProfile(userId)
      .then((data) => {
        if (!cancelled) setOwnProfile(data);
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
  }, [invalidId, isOwnProfile, userId]);

  if (invalidId) {
    return <Navigate to="/perfil" replace />;
  }

  if (loading) {
    return (
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-8 pb-0">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-96 h-[800px] rounded-2xl bg-gray-200 animate-pulse" />
          <div className="flex-1 h-96 lg:h-[800px] rounded-2xl bg-gray-200 animate-pulse" />
        </div>
      </main>
    );
  }

  if (loadError || !profile) {
    return (
      <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-8 pb-0">
        <p className="text-center text-sm text-red-600">{loadError ?? "Não foi possível carregar este perfil."}</p>
      </main>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-8 pb-0">
      <div className="flex flex-col lg:flex-row gap-6">
        <ProfileSidebar
          profile={profile}
          isOwnProfile={isOwnProfile}
          onEdit={() => setEditOpen(true)}
          connectStatus={statusFor(profile.id)}
          onConnect={() => connect(profile.id)}
        />

        <div className="flex-1 flex flex-col gap-6 lg:h-[800px]">
          {!isOwnProfile && ownProfile && (
            <ConnectionBanner own={ownProfile.academicProfiles} other={profile.academicProfiles} />
          )}

          <AboutSection bio={profile.bio} />
          <ProfileTabs academicProfiles={profile.academicProfiles} currentPosition={profile.currentPosition} />
        </div>
      </div>

      {isOwnProfile && <EditProfileModal isOpen={editOpen} onClose={() => setEditOpen(false)} profile={profile} />}
    </main>
  );
}
