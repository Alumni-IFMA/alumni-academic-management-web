import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminNewsForm } from "../index";
import * as newsService from "../../../services/newsService";
import type { NewsRawDto } from "../../../services/newsService";

vi.mock("../../../services/newsService");

const mockedNewsService = newsService as Mocked<typeof newsService>;

function renderCreate() {
  return render(
    <MemoryRouter initialEntries={["/admin/news/new"]}>
      <Routes>
        <Route path="/admin/news/new" element={<AdminNewsForm />} />
        <Route path="/admin/news" element={<div>List page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

function renderEdit() {
  return render(
    <MemoryRouter initialEntries={["/admin/news/edit/7"]}>
      <Routes>
        <Route path="/admin/news/edit/:id" element={<AdminNewsForm />} />
        <Route path="/admin/news" element={<div>List page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminNewsForm - create mode", () => {
  beforeEach(() => vi.clearAllMocks());

  it("publishes immediately: calls createNews with draft=false and no publishedAt", async () => {
    mockedNewsService.createNews.mockResolvedValue({ id: 1 } as unknown as NewsRawDto);
    renderCreate();

    await userEvent.type(screen.getByPlaceholderText("Titulo"), "New title");
    await userEvent.type(screen.getByPlaceholderText("Matéria"), "Body");
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));

    await waitFor(() => expect(mockedNewsService.createNews).toHaveBeenCalledTimes(1));
    const formData = mockedNewsService.createNews.mock.calls[0][0];
    expect(formData.get("title")).toBe("New title");
    expect(formData.get("draft")).toBe("false");
    expect(formData.has("publishedAt")).toBe(false);
    expect(screen.getByText("List page")).toBeInTheDocument();
  });

  it("includes the Resumo field in the submitted FormData", async () => {
    mockedNewsService.createNews.mockResolvedValue({ id: 1 } as unknown as NewsRawDto);
    renderCreate();

    await userEvent.type(screen.getByPlaceholderText("Titulo"), "New title");
    await userEvent.type(screen.getByPlaceholderText("Resumo (opcional)"), "Short summary");
    await userEvent.type(screen.getByPlaceholderText("Matéria"), "Body");
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));

    await waitFor(() => expect(mockedNewsService.createNews).toHaveBeenCalledTimes(1));
    const formData = mockedNewsService.createNews.mock.calls[0][0];
    expect(formData.get("summary")).toBe("Short summary");
  });

  it("saves as draft: calls createNews with draft=true", async () => {
    mockedNewsService.createNews.mockResolvedValue({ id: 1 } as unknown as NewsRawDto);
    renderCreate();

    await userEvent.type(screen.getByPlaceholderText("Titulo"), "Draft title");
    await userEvent.type(screen.getByPlaceholderText("Matéria"), "Body");
    await userEvent.click(screen.getByRole("button", { name: "Salvar Rascunho" }));

    await waitFor(() => expect(mockedNewsService.createNews).toHaveBeenCalledTimes(1));
    const formData = mockedNewsService.createNews.mock.calls[0][0];
    expect(formData.get("draft")).toBe("true");
  });

  it("disables the submit buttons while submitting", async () => {
    mockedNewsService.createNews.mockReturnValue(new Promise(() => {}));
    renderCreate();

    await userEvent.type(screen.getByPlaceholderText("Titulo"), "T");
    await userEvent.type(screen.getByPlaceholderText("Matéria"), "B");
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));

    await waitFor(() => expect(screen.getByRole("button", { name: "Salvando..." })).toBeDisabled());
  });
});

describe("AdminNewsForm - edit mode", () => {
  beforeEach(() => vi.clearAllMocks());

  it("shows a loading state while fetching the existing news", () => {
    mockedNewsService.getNewsById.mockReturnValue(new Promise(() => {}));
    renderEdit();
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("populates the form with fetched data", async () => {
    mockedNewsService.getNewsById.mockResolvedValue({
      id: 7,
      title: "Existing",
      summary: "Existing summary",
      content: "Existing body",
      coverImageUrl: "/cover.jpg",
      draft: false,
      publishedAt: null,
    });
    renderEdit();

    await waitFor(() => {
      expect(screen.getByPlaceholderText("Titulo")).toHaveValue("Existing");
      expect(screen.getByPlaceholderText("Resumo (opcional)")).toHaveValue("Existing summary");
      expect(screen.getByPlaceholderText("Matéria")).toHaveValue("Existing body");
    });
  });

  it("calls updateNews with the existing id on publish", async () => {
    mockedNewsService.getNewsById.mockResolvedValue({
      id: 7,
      title: "Existing",
      content: "Existing body",
      coverImageUrl: "/cover.jpg",
      draft: true,
      publishedAt: null,
    });
    mockedNewsService.updateNews.mockResolvedValue({ id: 7 } as unknown as NewsRawDto);
    renderEdit();

    await waitFor(() => expect(screen.getByPlaceholderText("Titulo")).toHaveValue("Existing"));
    await userEvent.click(screen.getByRole("button", { name: "Publicar" }));

    await waitFor(() => expect(mockedNewsService.updateNews).toHaveBeenCalledWith("7", expect.any(FormData)));
  });

  it("deletes the news on confirm", async () => {
    mockedNewsService.getNewsById.mockResolvedValue({
      id: 7,
      title: "Existing",
      content: "Existing body",
      coverImageUrl: "/cover.jpg",
      draft: false,
      publishedAt: null,
    });
    mockedNewsService.deleteNews.mockResolvedValue();
    renderEdit();

    await waitFor(() => expect(screen.getByPlaceholderText("Titulo")).toHaveValue("Existing"));
    await userEvent.click(screen.getByRole("button", { name: /Excluir/i }));
    const excluirButtons = screen.getAllByRole("button", { name: "Excluir" });
    await userEvent.click(excluirButtons[excluirButtons.length - 1]);

    await waitFor(() => {
      expect(mockedNewsService.deleteNews).toHaveBeenCalledWith("7");
      expect(screen.getByText("List page")).toBeInTheDocument();
    });
  });
});
