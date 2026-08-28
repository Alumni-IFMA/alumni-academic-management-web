import { describe, it, expect } from "vitest";
import { mapNewsDetail } from "../mapNewsDetail";
import type { NewsRawDto } from "../../../services/newsService";

describe("mapNewsDetail", () => {
  it("maps a NewsResponseDTO to the detail page shape", () => {
    const dto: NewsRawDto = {
      id: 1,
      title: "Seletivo IFMA",
      content: "Texto completo da notícia.",
      coverImageUrl: "https://cdn/img.jpg",
      publishedAt: [2025, 11, 25, 10, 0],
      draft: false,
    };

    expect(mapNewsDetail(dto)).toEqual({
      id: 1,
      title: "Seletivo IFMA",
      content: "Texto completo da notícia.",
      coverImage: "https://cdn/img.jpg",
      publishedAt: "25/11/2025",
    });
  });

  it("falls back publishedAt to createdAt when publishedAt is missing", () => {
    const dto: NewsRawDto = {
      id: 2,
      title: "SEXTOU!?",
      content: "...",
      coverImageUrl: "https://cdn/img.jpg",
      publishedAt: null,
      createdAt: [2026, 8, 6, 1, 19, 20],
      draft: false,
    };

    expect(mapNewsDetail(dto).publishedAt).toBe("06/08/2026");
  });

  it("defaults content to an empty string when missing", () => {
    const dto: NewsRawDto = { id: 3, title: "T", content: null, publishedAt: null, draft: false };
    expect(mapNewsDetail(dto).content).toBe("");
  });
});
