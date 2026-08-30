import { describe, it, expect } from "vitest";
import { mapUser, type UserSimpleDto } from "../userService";

describe("mapUser", () => {
  it("maps id, name and the first academic profile into subtitle/meta", () => {
    const dto: UserSimpleDto = {
      id: 7,
      name: "Júlio Reis",
      email: "julio@example.com",
      status: "ACTIVE",
      role: "ALUMNI",
      academicProfiles: [
        {
          id: 1,
          entryYear: 2018,
          conclusionYear: 2022,
          campusName: "Campus Central",
          courseName: "Ciência da Computação",
          level: "GRADUACAO",
          modality: "BACHARELADO",
        },
      ],
    };

    expect(mapUser(dto)).toEqual({
      id: 7,
      name: "Júlio Reis",
      subtitle: "Ciência da Computação",
      meta: "Campus Central · 2018-2022",
      avatarUrl: null,
    });
  });

  it("omits subtitle/meta when there is no academic profile", () => {
    const dto: UserSimpleDto = {
      id: 8,
      name: "Kenia Reis",
      email: "kenia@example.com",
      status: "ACTIVE",
      role: "ALUMNI",
      academicProfiles: [],
    };

    expect(mapUser(dto)).toEqual({
      id: 8,
      name: "Kenia Reis",
      subtitle: undefined,
      meta: undefined,
      avatarUrl: null,
    });
  });
});
