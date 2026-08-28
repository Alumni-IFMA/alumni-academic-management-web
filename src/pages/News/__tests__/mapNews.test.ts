import { describe, it, expect } from "vitest";
import { mapNews } from "../mapNews";
import type { NewsRawDto } from "../../../services/newsService";

describe("mapNews", () => {
  it("maps a NewsResponseDTO to the listing card shape", () => {
    const dto: NewsRawDto = {
      id: 1,
      title: "Seletivo IFMA",
      summary: "Inscrições abertas.",
      coverImageUrl: "https://cdn/img.jpg",
      publishedAt: [2025, 11, 25, 10, 0],
      draft: false,
    };

    expect(mapNews(dto)).toEqual({
      id: 1,
      title: "Seletivo IFMA",
      description: "Inscrições abertas.",
      coverImage: "https://cdn/img.jpg",
      publishedAt: "25/11/2025",
    });
  });

  it("falls back publishedAt to createdAt when publishedAt is missing", () => {
    const dto: NewsRawDto = {
      id: 2,
      title: "SEXTOU!?",
      summary: "",
      content: "Jovens esperam ansiosamente...",
      coverImageUrl: "https://cdn/img.jpg",
      publishedAt: null,
      createdAt: [2026, 8, 6, 1, 19, 20],
      draft: false,
    };

    expect(mapNews(dto).publishedAt).toBe("06/08/2026");
  });

  it("falls back description to a truncated content when summary is empty", () => {
    const longContent = "A".repeat(200);
    const dto: NewsRawDto = { id: 3, title: "T", summary: "", content: longContent, publishedAt: null, draft: false };

    expect(mapNews(dto).description).toBe(`${"A".repeat(150)}...`);
  });

  it("does not truncate content used as description fallback when it is short", () => {
    const dto: NewsRawDto = { id: 4, title: "T", summary: "", content: "Short content.", publishedAt: null, draft: false };

    expect(mapNews(dto).description).toBe("Short content.");
  });
});
