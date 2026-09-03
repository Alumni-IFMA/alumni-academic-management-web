import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { AuthContext } from "../../../context/AuthContext";
import { Navbar } from "../Navbar";
import profileService from "../../../services/profileService";
import networkAlumni from "../../../services/networkAlumni";
import { getAvatarForUser } from "../../../pages/Network/avatarFallback";

vi.mock("../../../services/profileService");
vi.mock("../../../services/networkAlumni");
const mockedProfileService = profileService as Mocked<typeof profileService>;
const mockedNetworkAlumni = networkAlumni as Mocked<typeof networkAlumni>;

const fakeAuth = { isAuthenticated: true, userName: "Kenia", userId: 4, login: vi.fn(), logout: vi.fn() };

function renderNavbar() {
  return render(
    <AuthContext.Provider value={fakeAuth}>
      <MemoryRouter>
        <Navbar />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Navbar avatar", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
    mockedNetworkAlumni.getPendingRequests.mockResolvedValue([]);
  });

  it("shows the fallback avatar, then swaps to the real photo once it loads (no cache yet)", async () => {
    mockedProfileService.getProfile.mockResolvedValue({
      id: 4,
      name: "Kenia",
      email: "k@x.com",
      avatarUrl: "https://cdn.example.com/kenia.jpg",
      academicProfiles: [],
    });

    renderNavbar();

    expect(screen.getByAltText("Foto de perfil")).toHaveAttribute("src", getAvatarForUser(4));

    await waitFor(() =>
      expect(screen.getByAltText("Foto de perfil")).toHaveAttribute("src", "https://cdn.example.com/kenia.jpg")
    );
  });

  it("shows the cached avatar immediately on mount, instead of flashing the fallback", () => {
    localStorage.setItem("avatarUrl:4", "https://cdn.example.com/cached.jpg");
    mockedProfileService.getProfile.mockReturnValue(new Promise(() => {}));

    renderNavbar();

    expect(screen.getByAltText("Foto de perfil")).toHaveAttribute("src", "https://cdn.example.com/cached.jpg");
  });

  it("caches the fetched avatar so a future mount can use it", async () => {
    mockedProfileService.getProfile.mockResolvedValue({
      id: 4,
      name: "Kenia",
      email: "k@x.com",
      avatarUrl: "https://cdn.example.com/fresh.jpg",
      academicProfiles: [],
    });

    renderNavbar();

    await waitFor(() => expect(localStorage.getItem("avatarUrl:4")).toBe("https://cdn.example.com/fresh.jpg"));
  });
});
