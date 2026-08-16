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

  it("falls back publishedAt to createdAt for a published item with no publishedAt (publish-now)", () => {
    const dto = {
      id: 4,
      title: "SEXTOU!?",
      summary: "",
      content: "Jovens esperam ansiosamente...",
      coverImageUrl: "https://cdn/img.jpg",
      draft: false,
      publishedAt: null,
      createdAt: [2026, 8, 6, 1, 19, 20],
    };

    const result = mapAdminNews(dto);
    expect(result.status).toBe("published");
    expect(result.publishedAt).toBe("06/08/2026");
  });

  it("does not fall back to createdAt for a draft with no publishedAt", () => {
    const dto = {
      id: 5,
      title: "T",
      summary: "S",
      draft: true,
      publishedAt: null,
      createdAt: [2026, 8, 6, 1, 19, 20],
    };

    expect(mapAdminNews(dto).publishedAt).toBe("Não publicado");
  });

  it("falls back description to a truncated content when summary is empty", () => {
    const longContent = "A".repeat(200);
    const dto = { id: 6, title: "T", summary: "", content: longContent, draft: false, publishedAt: null };

    const result = mapAdminNews(dto);
    expect(result.description).toBe(`${"A".repeat(150)}...`);
  });

  it("does not truncate content used as description fallback when it is short", () => {
    const dto = { id: 7, title: "T", summary: "", content: "Short content.", draft: false, publishedAt: null };

    expect(mapAdminNews(dto).description).toBe("Short content.");
  });
});
