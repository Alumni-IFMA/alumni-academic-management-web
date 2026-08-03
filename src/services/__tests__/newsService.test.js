import { describe, it, expect, vi, beforeEach } from "vitest";
import api from "../api";
import { getLatestNews } from "../newsService";

vi.mock("../api");

describe("newsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /news?limit=3 and returns data", async () => {
    const mockNews = [
      { id: 1, title: "Notícia 1", description: "Resumo 1", coverImage: "/img1.jpg", publishedAt: "2026-01-01" },
    ];
    api.get.mockResolvedValue({ data: mockNews });

    const result = await getLatestNews();

    expect(api.get).toHaveBeenCalledWith("/news", { params: { limit: 3 } });
    expect(result).toEqual(mockNews);
  });
});
