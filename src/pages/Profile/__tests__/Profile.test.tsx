import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { AuthContext } from "../../../context/AuthContext";
import { Profile } from "../index";
import profileService from "../../../services/profileService";
import type { UserProfile } from "../../../services/profileService";

vi.mock("../../../services/profileService");
const mockedProfileService = profileService as Mocked<typeof profileService>;

vi.mock("../../../hooks/useConnection", () => ({
  useConnection: () => ({ connect: vi.fn(), disconnect: vi.fn(), statusFor: () => "idle" as const }),
}));

const fakeAuth = { isAuthenticated: true, userName: "Kenia", userId: 1, login: vi.fn(), logout: vi.fn() };

const ownProfile: UserProfile = {
  id: 1,
  name: "Kenia Reis",
  email: "kenia@example.com",
  avatarUrl: null,
  academicProfiles: [
    {
      id: 1,
      entryYear: 2018,
      conclusionYear: 2022,
      campusName: "Campus São Luís",
      courseName: "ADS",
      level: "GRADUACAO",
      modality: "BACHARELADO",
    },
  ],
};

const otherProfile: UserProfile = {
  id: 2,
  name: "João Silva",
  email: "joao@example.com",
  avatarUrl: null,
  academicProfiles: [
    {
      id: 2,
      entryYear: 2018,
      conclusionYear: 2022,
      campusName: "Campus São Luís",
      courseName: "ADS",
      level: "GRADUACAO",
      modality: "BACHARELADO",
    },
  ],
};

function renderAt(path: string) {
  return render(
    <AuthContext.Provider value={fakeAuth}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/perfil" element={<Profile />} />
          <Route path="/perfil/:id" element={<Profile />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Profile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the own-profile variant with an Editar button and no connection banner", async () => {
    mockedProfileService.getProfile.mockResolvedValue(ownProfile);
    renderAt("/perfil");

    expect(await screen.findByText("Kenia Reis")).toBeInTheDocument();
    expect(screen.getByLabelText("Editar perfil")).toBeInTheDocument();
    expect(screen.queryByText(/Mesmo curso e campus/)).not.toBeInTheDocument();
    expect(screen.getByLabelText("Voltar")).toBeInTheDocument();
  });

  it("shows the other-profile variant with a connect button and the connection banner", async () => {
    mockedProfileService.getProfile.mockImplementation((id: number) =>
      Promise.resolve(id === 1 ? ownProfile : otherProfile)
    );
    renderAt("/perfil/2");

    expect(await screen.findByText("João Silva")).toBeInTheDocument();
    expect(screen.getByText("Conectar")).toBeInTheDocument();
    expect(await screen.findByText(/Mesmo curso e campus/)).toBeInTheDocument();
  });

  it("shows a loading skeleton while the profile is being fetched", () => {
    mockedProfileService.getProfile.mockReturnValue(new Promise(() => {}));
    const { container } = renderAt("/perfil");
    expect(container.querySelector(".animate-pulse")).toBeInTheDocument();
  });

  it("shows an error message when the profile fails to load", async () => {
    mockedProfileService.getProfile.mockRejectedValue(new Error("network error"));
    renderAt("/perfil");

    expect(await screen.findByText("Não foi possível carregar este perfil.")).toBeInTheDocument();
  });

  it("redirects to /perfil when the id param is not a valid number", async () => {
    mockedProfileService.getProfile.mockResolvedValue(ownProfile);
    renderAt("/perfil/abc");

    expect(await screen.findByText("Kenia Reis")).toBeInTheDocument();
    expect(screen.getByLabelText("Editar perfil")).toBeInTheDocument();
  });
});
