import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import profileService from "../profileService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

describe("profileService.getProfile", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /auth/users/{id}/profile and maps the response", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        id: 1,
        name: "Kenia Reis",
        email: "kenia@example.com",
        bio: "Desenvolvedora",
        profilePictureUrl: "https://cdn.example.com/kenia.jpg",
        linkedinUrl: "https://linkedin.com/in/kenia",
        portfolioUrl: "https://kenia.dev",
        currentPosition: "Engenheira de Software",
        accountStatus: "ACTIVE",
        role: "ALUMNI",
        hasSeenTutorial: true,
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
      },
    });

    const result = await profileService.getProfile(1);

    expect(mockedApi.get).toHaveBeenCalledWith("/auth/users/1/profile");
    expect(result).toEqual({
      id: 1,
      name: "Kenia Reis",
      email: "kenia@example.com",
      bio: "Desenvolvedora",
      avatarUrl: "https://cdn.example.com/kenia.jpg",
      linkedinUrl: "https://linkedin.com/in/kenia",
      portfolioUrl: "https://kenia.dev",
      currentPosition: "Engenheira de Software",
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
    });
  });

  it("falls back avatarUrl to null when profilePictureUrl is missing", async () => {
    mockedApi.get.mockResolvedValue({
      data: {
        id: 2,
        name: "João Silva",
        email: "joao@example.com",
        accountStatus: "ACTIVE",
        role: "ALUMNI",
        hasSeenTutorial: false,
        academicProfiles: [],
      },
    });

    const result = await profileService.getProfile(2);

    expect(result.avatarUrl).toBeNull();
  });
});
