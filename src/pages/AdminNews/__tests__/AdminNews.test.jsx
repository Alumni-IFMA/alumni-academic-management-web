import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AdminNews } from "../index";
import * as newsService from "../../../services/newsService";

vi.mock("../../../services/newsService");

const mockDtos = [
  { id: 1, title: "Seletivo IFMA", summary: "S1", coverImageUrl: "/img1.jpg", draft: false, publishedAt: [2020, 1, 1] },
  { id: 2, title: "Robótica", summary: "S2", coverImageUrl: "/img2.jpg", draft: true, publishedAt: null },
];

function renderAdminNews() {
  return render(
    <MemoryRouter initialEntries={["/admin/news"]}>
      <Routes>
        <Route path="/admin/news" element={<AdminNews />} />
        <Route path="/admin/news/new" element={<div>Form page</div>} />
        <Route path="/admin/news/edit/:id" element={<div>Edit page</div>} />
      </Routes>
    </MemoryRouter>
  );
}

describe("AdminNews page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    newsService.getAdminNews.mockResolvedValue(mockDtos);
  });

  it("shows a loading state while fetching", () => {
    newsService.getAdminNews.mockReturnValue(new Promise(() => {}));
    renderAdminNews();
    expect(screen.getByText(/carregando/i)).toBeInTheDocument();
  });

  it("renders mapped news cards after load", async () => {
    renderAdminNews();
    await waitFor(() => {
      expect(screen.getByText("Seletivo IFMA")).toBeInTheDocument();
      expect(screen.getByText("Robótica")).toBeInTheDocument();
    });
  });

  it("shows an error message when the fetch fails", async () => {
    newsService.getAdminNews.mockRejectedValue(new Error("network error"));
    renderAdminNews();
    await waitFor(() => {
      expect(screen.getByText(/não foi possível carregar/i)).toBeInTheDocument();
    });
  });

  it("filters by search text", async () => {
    renderAdminNews();
    await waitFor(() => expect(screen.getByText("Seletivo IFMA")).toBeInTheDocument());

    await userEvent.type(screen.getByPlaceholderText("Mentores, egressos e professores"), "Robótica");

    await waitFor(() => {
      expect(screen.queryByText("Seletivo IFMA")).not.toBeInTheDocument();
      expect(screen.getByText("Robótica")).toBeInTheDocument();
    });
  });

  it("navigates to the create form on 'Nova Notícia' click", async () => {
    renderAdminNews();
    await waitFor(() => expect(screen.getByText("Seletivo IFMA")).toBeInTheDocument());

    await userEvent.click(screen.getByRole("button", { name: /Nova Notícia/i }));

    expect(screen.getByText("Form page")).toBeInTheDocument();
  });

  it("deletes a news item on confirm", async () => {
    newsService.deleteNews.mockResolvedValue();
    renderAdminNews();
    await waitFor(() => expect(screen.getByText("Seletivo IFMA")).toBeInTheDocument());

    const [firstTrashButton] = screen.getAllByRole("button", { name: "" });
    await userEvent.click(firstTrashButton);
    await userEvent.click(screen.getByRole("button", { name: "Excluir" }));

    await waitFor(() => {
      expect(newsService.deleteNews).toHaveBeenCalledWith(1);
      expect(screen.queryByText("Seletivo IFMA")).not.toBeInTheDocument();
    });
  });
});
