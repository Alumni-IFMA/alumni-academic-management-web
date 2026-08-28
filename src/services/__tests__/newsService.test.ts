import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import {
  getLatestNews,
  getAdminNews,
  getNewsById,
  createNews,
  updateNews,
  deleteNews,
} from "../newsService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

describe("newsService", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /news?size=3 and returns data", async () => {
    const mockNews = [
      { id: 1, title: "Notícia 1", description: "Resumo 1", coverImage: "/img1.jpg", publishedAt: "2026-01-01" },
    ];
    mockedApi.get.mockResolvedValue({ data: mockNews });

    const result = await getLatestNews();

    expect(mockedApi.get).toHaveBeenCalledWith("/news", { params: { size: 3 } });
    expect(result).toEqual(mockNews);
  });
});

describe("getAdminNews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /news with given params and returns data", async () => {
    const mockPage = { content: [{ id: 1, title: "A" }] };
    mockedApi.get.mockResolvedValue({ data: mockPage });

    const result = await getAdminNews({ page: 0, size: 10 });

    expect(mockedApi.get).toHaveBeenCalledWith("/news", { params: { page: 0, size: 10 } });
    expect(result).toEqual(mockPage);
  });
});

describe("getNewsById", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /news/:id and returns data", async () => {
    const mockNews = { id: 5, title: "News 5" };
    mockedApi.get.mockResolvedValue({ data: mockNews });

    const result = await getNewsById(5);

    expect(mockedApi.get).toHaveBeenCalledWith("/news/5");
    expect(result).toEqual(mockNews);
  });
});

describe("createNews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls POST /news with the given FormData and returns data", async () => {
    const formData = new FormData();
    formData.append("title", "New title");
    const mockNews = { id: 9, title: "New title" };
    mockedApi.post.mockResolvedValue({ data: mockNews });

    const result = await createNews(formData);

    expect(mockedApi.post).toHaveBeenCalledWith("/news", formData);
    expect(result).toEqual(mockNews);
  });
});

describe("updateNews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls PUT /news/:id with the given FormData and returns data", async () => {
    const formData = new FormData();
    formData.append("title", "Updated title");
    const mockNews = { id: 9, title: "Updated title" };
    mockedApi.put.mockResolvedValue({ data: mockNews });

    const result = await updateNews(9, formData);

    expect(mockedApi.put).toHaveBeenCalledWith("/news/9", formData);
    expect(result).toEqual(mockNews);
  });
});

describe("deleteNews", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls DELETE /news/:id", async () => {
    mockedApi.delete.mockResolvedValue({});

    await deleteNews(9);

    expect(mockedApi.delete).toHaveBeenCalledWith("/news/9");
  });
});
