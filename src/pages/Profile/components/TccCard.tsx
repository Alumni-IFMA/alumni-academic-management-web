import { Download } from "lucide-react";
import { mockTcc } from "../mockProfileExtras";

export function TccCard() {
  return (
    <div className="rounded-xl bg-dark-green text-white p-4 flex items-center justify-between gap-4">
      <div className="min-w-0">
        {/* mock — aguardando backend, ver docs/superpowers/specs/2026-08-30-user-profile-page-design.md */}
        <p className="font-semibold mb-1">TCC</p>
        <p className="text-sm text-white/90">{mockTcc.title}</p>
        <p className="text-xs text-white/70">{mockTcc.year}</p>
      </div>
      <a
        href={mockTcc.fileUrl}
        target="_blank"
        rel="noreferrer"
        className="shrink-0 flex items-center gap-1.5 bg-green text-white text-sm font-medium px-4 py-2 rounded-full hover:bg-green-600 transition-colors whitespace-nowrap"
      >
        <Download size={16} /> Baixar
      </a>
    </div>
  );
}
