import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { NewsDetail } from "../index";
import * as newsService from "../../../services/newsService";
import type { NewsRawDto } from "../../../services/newsService";

vi.mock("../../../services/newsService");

const mockedNewsService = newsService as Mocked<typeof newsService>;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

const newsDto = {
  id: 1,
  title: "Seletivo Técnico - IFMA 2026",
  content: "Primeiro parágrafo.\n\nSegundo parágrafo.",
  coverImageUrl: "https://cdn/img.jpg",
  publishedAt: [2025, 11, 25],
} as unknown as NewsRawDto;

function renderPage(id = "1") {
  return render(
    <MemoryRouter initialEntries={[`/news/${id}`]}>
      <Routes>
        <Route path="/news/:id" element={<NewsDetail />} />
      </Routes>
    </MemoryRouter>
  );
}

describe("NewsDetail page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows a loading state while fetching", () => {
    mockedNewsService.getNewsById.mockReturnValue(new Promise(() => {}));
    renderPage();
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("loads the news by id and renders title, date and content", async () => {
    mockedNewsService.getNewsById.mockResolvedValue(newsDto);
    renderPage();

    await waitFor(() => {
      expect(mockedNewsService.getNewsById).toHaveBeenCalledWith("1");
      expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument();
      expect(screen.getByText("Publicado em 25/11/2025")).toBeInTheDocument();
      expect(screen.getByText(/Primeiro parágrafo\./)).toBeInTheDocument();
    });
  });

  it("sanitizes the content, stripping dangerous markup", async () => {
    mockedNewsService.getNewsById.mockResolvedValue({
      ...newsDto,
      content: '<img src=x onerror="window.__pwned = true">Conteúdo seguro.',
    });
    renderPage();

    await waitFor(() => expect(screen.getByText(/Conteúdo seguro\./)).toBeInTheDocument());
    expect(document.querySelector("img[onerror]")).not.toBeInTheDocument();
    expect((window as unknown as { __pwned?: boolean }).__pwned).toBeUndefined();
  });

  it("shows an error message when loading fails", async () => {
    mockedNewsService.getNewsById.mockRejectedValue(new Error("network error"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar a notícia.")).toBeInTheDocument();
    });
  });

  it("navigates back when the back button is clicked", async () => {
    mockedNewsService.getNewsById.mockResolvedValue(newsDto);
    renderPage();

    await waitFor(() => expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /voltar/i }));

    expect(mockNavigate).toHaveBeenCalledWith(-1);
  });
});
