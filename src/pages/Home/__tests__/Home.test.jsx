import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { AuthContext } from "../../../context/AuthContext";
import { Home } from "../index";
import * as newsService from "../../../services/newsService";
import * as jobsService from "../../../services/jobsService";

vi.mock("../../../services/newsService");
vi.mock("../../../services/jobsService");

const mockNews = [
  { id: 1, title: "Seletivo Técnico IFMA", description: "Inscrições abertas.", coverImage: "/img1.jpg" },
  { id: 2, title: "Copa de Robótica", description: "Competição de robótica.", coverImage: "/img2.jpg" },
  { id: 3, title: "Desafio Mermãs", description: "Mulheres na tecnologia.", coverImage: "/img3.jpg" },
];

const mockJobs = [
  { id: 1, title: "Desenvolvedor Backend", companyName: "Mermãs Digitais", companyLogo: "", location: "Imperatriz - MA", type: "Voluntário" },
  { id: 2, title: "Designer UX", companyName: "Tech Co", companyLogo: "", location: "São Luís - MA", type: "CLT" },
  { id: 3, title: "Analista de Dados", companyName: "DataLab", companyLogo: "", location: "Remoto", type: "Freelance" },
];

const fakeAuth = { isAuthenticated: true, userName: "Kenia", login: vi.fn(), logout: vi.fn() };

function renderHome() {
  return render(
    <AuthContext.Provider value={fakeAuth}>
      <MemoryRouter initialEntries={["/home"]}>
        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/network" element={<div>Rede page</div>} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Home page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    newsService.getLatestNews.mockResolvedValue(mockNews);
    jobsService.getLatestJobs.mockResolvedValue(mockJobs);
  });

  it("shows welcome message with user name", () => {
    renderHome();
    expect(screen.getByText(/Bem-vinda, Kenia!/i)).toBeInTheDocument();
  });

  it("renders 4 shortcut cards", () => {
    renderHome();
    expect(screen.getByText("Rede Alumni")).toBeInTheDocument();
    expect(screen.getByText("Feedback")).toBeInTheDocument();
    expect(screen.getByText("Biblioteca A+")).toBeInTheDocument();
    expect(screen.getByText("Diploma")).toBeInTheDocument();
  });

  it("renders news section heading and 3 news cards after load", async () => {
    renderHome();
    expect(screen.getByText("Notícias")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Seletivo Técnico IFMA")).toBeInTheDocument();
      expect(screen.getByText("Copa de Robótica")).toBeInTheDocument();
      expect(screen.getByText("Desafio Mermãs")).toBeInTheDocument();
    });
  });

  it("renders opportunities section heading and 3 job cards after load", async () => {
    renderHome();
    expect(screen.getByText("Oportunidades")).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText("Desenvolvedor Backend")).toBeInTheDocument();
      expect(screen.getByText("Designer UX")).toBeInTheDocument();
      expect(screen.getByText("Analista de Dados")).toBeInTheDocument();
    });
  });

  it("navigates to /network with search term on search submit", async () => {
    renderHome();
    const input = screen.getByPlaceholderText("Mentores, egressos e professores");
    await userEvent.type(input, "Maria");
    await userEvent.click(screen.getByRole("button", { name: /Buscar/i }));
    await waitFor(() => {
      expect(screen.getByText("Rede page")).toBeInTheDocument();
    });
  });

  it("shows error message when news fetch fails", async () => {
    newsService.getLatestNews.mockRejectedValue(new Error("network error"));
    renderHome();
    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as notícias.")).toBeInTheDocument();
    });
  });

  it("shows error message when jobs fetch fails", async () => {
    jobsService.getLatestJobs.mockRejectedValue(new Error("network error"));
    renderHome();
    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as oportunidades.")).toBeInTheDocument();
    });
  });
});
