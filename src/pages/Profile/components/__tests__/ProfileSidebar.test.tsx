import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { ProfileSidebar } from "../ProfileSidebar";
import type { UserProfile } from "../../../../services/profileService";

const otherProfile: UserProfile = {
  id: 2,
  name: "João Silva",
  email: "joao@example.com",
  avatarUrl: null,
  academicProfiles: [],
};

describe("ProfileSidebar", () => {
  it("shows a Conectar button when not yet connected", () => {
    render(
      <ProfileSidebar
        profile={otherProfile}
        isOwnProfile={false}
        onEdit={vi.fn()}
        connectStatus="idle"
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );

    expect(screen.getByText("Conectar")).toBeInTheDocument();
    expect(screen.queryByText("Desfazer conexão")).not.toBeInTheDocument();
  });

  it("shows a 'Desfazer conexão' option instead of Conectar when already connected", () => {
    render(
      <ProfileSidebar
        profile={otherProfile}
        isOwnProfile={false}
        onEdit={vi.fn()}
        connectStatus="connected"
        onConnect={vi.fn()}
        onDisconnect={vi.fn()}
      />
    );

    expect(screen.queryByText("Conectar")).not.toBeInTheDocument();
    expect(screen.getByText("Desfazer conexão")).toBeInTheDocument();
  });

  it("asks for confirmation before disconnecting, and only calls onDisconnect after confirming", async () => {
    const onDisconnect = vi.fn();
    render(
      <ProfileSidebar
        profile={otherProfile}
        isOwnProfile={false}
        onEdit={vi.fn()}
        connectStatus="connected"
        onConnect={vi.fn()}
        onDisconnect={onDisconnect}
      />
    );

    await userEvent.click(screen.getByText("Desfazer conexão"));
    expect(onDisconnect).not.toHaveBeenCalled();

    expect(await screen.findByText(/Tem certeza/)).toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: "Desfazer" }));
    expect(onDisconnect).toHaveBeenCalled();
  });
});
