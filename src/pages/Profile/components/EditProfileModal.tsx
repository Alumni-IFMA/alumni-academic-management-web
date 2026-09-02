import { X } from "lucide-react";
import { FormField } from "../../../components/FormField/FormField";
import { InputField } from "../../../components/InputField/InputField";
import { Textarea } from "../../../components/Textarea/Textarea";
import type { UserProfile } from "../../../services/profileService";

export function EditProfileModal({
  isOpen,
  onClose,
  profile,
}: {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl p-6 flex flex-col gap-4 min-w-[340px] w-full max-w-md">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900 text-lg">Editar perfil</span>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <form className="flex flex-col gap-4">
          <FormField>
            <label htmlFor="bio" className="text-sm font-medium text-gray-700">
              Bio
            </label>
            <Textarea id="bio" rows={3} defaultValue={profile.bio ?? ""} />
          </FormField>

          <FormField>
            <label htmlFor="currentPosition" className="text-sm font-medium text-gray-700">
              Cargo atual
            </label>
            <InputField id="currentPosition" defaultValue={profile.currentPosition ?? ""} />
          </FormField>

          <FormField>
            <label htmlFor="linkedinUrl" className="text-sm font-medium text-gray-700">
              LinkedIn
            </label>
            <InputField id="linkedinUrl" defaultValue={profile.linkedinUrl ?? ""} />
          </FormField>

          <FormField>
            <label htmlFor="portfolioUrl" className="text-sm font-medium text-gray-700">
              Portfólio
            </label>
            <InputField id="portfolioUrl" defaultValue={profile.portfolioUrl ?? ""} />
          </FormField>

          <div className="flex flex-col gap-1 mt-2">
            <button
              type="button"
              disabled
              className="w-full bg-dark-green text-white font-semibold py-3 rounded-xl opacity-50 cursor-not-allowed"
            >
              Salvar
            </button>
            <p className="text-xs text-gray-400 text-center">Edição de perfil disponível em breve</p>
          </div>
        </form>
      </div>
    </div>
  );
}
