import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { EditProfileModal } from "../EditProfileModal";
import type { UserProfile } from "../../../../services/profileService";

const profile: UserProfile = {
  id: 1,
  name: "Kenia Reis",
  email: "kenia@example.com",
  bio: "Desenvolvedora",
  avatarUrl: null,
  linkedinUrl: "https://linkedin.com/in/kenia",
  portfolioUrl: "https://kenia.dev",
  currentPosition: "Engenheira de Software",
  academicProfiles: [],
};

describe("EditProfileModal", () => {
  it("renders nothing when closed", () => {
    const { container } = render(<EditProfileModal isOpen={false} onClose={vi.fn()} profile={profile} />);
    expect(container).toBeEmptyDOMElement();
  });

  it("opens with the profile fields pre-filled", () => {
    render(<EditProfileModal isOpen onClose={vi.fn()} profile={profile} />);

    expect(screen.getByLabelText("Bio")).toHaveValue("Desenvolvedora");
    expect(screen.getByLabelText("Cargo atual")).toHaveValue("Engenheira de Software");
    expect(screen.getByLabelText("LinkedIn")).toHaveValue("https://linkedin.com/in/kenia");
    expect(screen.getByLabelText("Portfólio")).toHaveValue("https://kenia.dev");
  });

  it("keeps the Salvar button disabled with an explanatory note", () => {
    render(<EditProfileModal isOpen onClose={vi.fn()} profile={profile} />);

    expect(screen.getByText("Salvar")).toBeDisabled();
    expect(screen.getByText("Edição de perfil disponível em breve")).toBeInTheDocument();
  });
});
