import { describe, it, expect } from "vitest";
import { mapAdminNews } from "../mapAdminNews";

describe("mapAdminNews", () => {
  it("maps a published NewsResponseDTO to the NewsCard shape", () => {
    const dto = {
      id: 1,
      title: "Seletivo IFMA",
      summary: "Inscrições abertas.",
      coverImageUrl: "https://cdn/img.jpg",
      draft: false,
      publishedAt: [2020, 1, 1, 10, 0],
    };

    expect(mapAdminNews(dto)).toEqual({
      id: 1,
      title: "Seletivo IFMA",
      description: "Inscrições abertas.",
      coverImage: "https://cdn/img.jpg",
      status: "published",
      publishedAt: "01/01/2020",
    });
  });

  it("maps a draft NewsResponseDTO with null publishedAt", () => {
    const dto = { id: 2, title: "T", summary: "S", coverImageUrl: null, draft: true, publishedAt: null };

    const result = mapAdminNews(dto);
    expect(result.status).toBe("draft");
    expect(result.publishedAt).toBe("Não publicado");
  });
});
