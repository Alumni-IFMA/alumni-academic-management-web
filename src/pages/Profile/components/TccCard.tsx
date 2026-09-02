import { mockTcc } from "../mockProfileExtras";

export function TccCard() {
  return (
    <div className="rounded-xl border border-gray-100 p-4">
      {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
      <p className="font-semibold text-dark-green mb-1">TCC</p>
      <p className="text-sm text-gray-600">{mockTcc.title}</p>
      <p className="text-xs text-gray-400">{mockTcc.year}</p>
    </div>
  );
}
