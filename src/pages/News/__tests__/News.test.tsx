import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { News } from "../index";
import * as newsService from "../../../services/newsService";
import type { NewsRawDto } from "../../../services/newsService";
import type { Page } from "../../../services/api";

vi.mock("../../../services/newsService");

const mockedNewsService = newsService as Mocked<typeof newsService>;

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return { ...actual, useNavigate: () => mockNavigate };
});

function makePage(content: NewsRawDto[], overrides: Partial<Page<NewsRawDto>> = {}): Page<NewsRawDto> {
  return { content, totalPages: 1, number: 0, last: true, ...overrides };
}

const news1Dto = {
  id: 1,
  title: "Seletivo Técnico - IFMA 2026",
  summary: "Inscrições abertas para novos alunos.",
  coverImageUrl: "https://cdn/img1.jpg",
  publishedAt: [2025, 11, 25],
} as unknown as NewsRawDto;

const news2Dto = {
  id: 2,
  title: "5º Copa de Robótica",
  summary: "É oficial: este será o maior evento.",
  coverImageUrl: "https://cdn/img2.jpg",
  publishedAt: [2025, 11, 20],
} as unknown as NewsRawDto;

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/news"]}>
      <News />
    </MemoryRouter>
  );
}

describe("News page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads news on mount and renders them", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([news1Dto, news2Dto]));
    renderPage();

    await waitFor(() => {
      expect(mockedNewsService.getNews).toHaveBeenCalledWith({ page: 0, size: 9, sort: undefined });
      expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument();
      expect(screen.getByText("5º Copa de Robótica")).toBeInTheDocument();
    });
  });

  it("shows an error message when loading fails", async () => {
    mockedNewsService.getNews.mockRejectedValue(new Error("network error"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as notícias.")).toBeInTheDocument();
    });
  });

  it("shows an empty state when the backend has no news at all", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([]));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Nenhuma notícia disponível no momento.")).toBeInTheDocument();
    });
  });

  it("filters the already-loaded news by title as the user types, without re-fetching", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([news1Dto, news2Dto]));
    renderPage();
    await waitFor(() => expect(screen.getByText("5º Copa de Robótica")).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText("Procure por notícias"), "robótica");

    await waitFor(() => {
      expect(screen.queryByText("Seletivo Técnico - IFMA 2026")).not.toBeInTheDocument();
      expect(screen.getByText("5º Copa de Robótica")).toBeInTheDocument();
    });

    expect(mockedNewsService.getNews).toHaveBeenCalledTimes(1);
  });

  it("shows a 'not found' message when the search matches nothing, without discarding the loaded news", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([news1Dto]));
    renderPage();
    await waitFor(() => expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText("Procure por notícias"), "xyz-nao-existe");

    await waitFor(() => {
      expect(screen.getByText("Nenhuma notícia encontrada.")).toBeInTheDocument();
    });

    expect(mockedNewsService.getNews).toHaveBeenCalledTimes(1);
  });

  it("re-fetches from the server when the sort dropdown changes", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([news1Dto]));
    renderPage();
    await waitFor(() => expect(mockedNewsService.getNews).toHaveBeenCalledTimes(1));

    await userEvent.selectOptions(screen.getByDisplayValue("Todas"), "recent");

    await waitFor(() => {
      expect(mockedNewsService.getNews).toHaveBeenLastCalledWith({ page: 0, size: 9, sort: "publishedAt,desc" });
    });
  });

  it("appends the next page on 'Carregar mais notícias' and hides the button on the last page", async () => {
    mockedNewsService.getNews
      .mockResolvedValueOnce(makePage([news1Dto], { last: false }))
      .mockResolvedValueOnce(makePage([news2Dto], { last: true }));

    renderPage();
    await waitFor(() => expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /carregar mais notícias/i }));

    await waitFor(() => {
      expect(mockedNewsService.getNews).toHaveBeenLastCalledWith({ page: 1, size: 9, sort: undefined });
      expect(screen.getByText("5º Copa de Robótica")).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /carregar mais notícias/i })).not.toBeInTheDocument();
  });

  it("does not render the load more button when the first page is already the last", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([news1Dto], { last: true }));
    renderPage();

    await waitFor(() => expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument());
    expect(screen.queryByRole("button", { name: /carregar mais notícias/i })).not.toBeInTheDocument();
  });

  it("navigates to the news detail page when 'Ver mais' is clicked", async () => {
    mockedNewsService.getNews.mockResolvedValue(makePage([news1Dto]));
    renderPage();

    await waitFor(() => expect(screen.getByText("Seletivo Técnico - IFMA 2026")).toBeInTheDocument());
    await userEvent.click(screen.getByRole("button", { name: /ver mais/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/news/1");
  });
});
