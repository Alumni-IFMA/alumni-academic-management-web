import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../context/AuthContext";
import { Opportunities } from "../index";
import * as jobsService from "../../../services/jobsService";

vi.mock("../../../services/jobsService");

function makePage(content, overrides = {}) {
  return { content, totalPages: 1, number: 0, last: true, ...overrides };
}

const job1Dto = {
  id: 1,
  title: "Desenvolvedor Java",
  company: "Empresa A",
  companyLogoUrl: "",
  description: "Descrição A",
  location: "São Paulo, SP",
  area: "Tecnologia",
  workplaceType: "HYBRID",
  experienceLevel: "SENIOR",
  requirements: [],
  benefits: [],
  createdAt: [2026, 8, 1, 12, 0, 0, 0],
};

const job2Dto = {
  id: 2,
  title: "Designer UX",
  company: "Empresa B",
  companyLogoUrl: "",
  description: "Descrição B",
  location: "Remoto",
  area: "Design",
  workplaceType: "REMOTE",
  experienceLevel: "JUNIOR",
  requirements: [],
  benefits: [],
  createdAt: [2026, 8, 1, 12, 0, 0, 0],
};

const fakeAuth = { isAuthenticated: true, userName: "Kenia", login: vi.fn(), logout: vi.fn() };

function renderPage() {
  return render(
    <AuthContext.Provider value={fakeAuth}>
      <MemoryRouter initialEntries={["/opportunities"]}>
        <Opportunities />
      </MemoryRouter>
    </AuthContext.Provider>
  );
}

describe("Opportunities page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("loads jobs on mount with no filters", async () => {
    jobsService.getJobs.mockResolvedValue(makePage([job1Dto, job2Dto]));
    renderPage();

    await waitFor(() => {
      expect(jobsService.getJobs).toHaveBeenCalledWith(expect.objectContaining({ page: 0, size: 10 }));
      // job1 is auto-selected, so it renders in both the list and the detail panel
      expect(screen.getAllByText("Desenvolvedor Java").length).toBeGreaterThan(0);
      expect(screen.getByText("Designer UX")).toBeInTheDocument();
    });
  });

  it("shows an error message when loading fails", async () => {
    jobsService.getJobs.mockRejectedValue(new Error("network error"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as vagas.")).toBeInTheDocument();
    });
  });

  it("shows an empty state when there are no matching jobs", async () => {
    jobsService.getJobs.mockResolvedValue(makePage([]));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Nenhuma vaga encontrada com esses filtros.")).toBeInTheDocument();
    });
  });

  it("debounces the keyword search before re-fetching", async () => {
    jobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    renderPage();
    await waitFor(() => expect(jobsService.getJobs).toHaveBeenCalledTimes(1));

    await userEvent.type(screen.getByPlaceholderText("Procure por oportunidades"), "java");

    await waitFor(
      () => {
        expect(jobsService.getJobs).toHaveBeenLastCalledWith(
          expect.objectContaining({ keyword: "java", page: 0 })
        );
      },
      { timeout: 1000 }
    );

    expect(jobsService.getJobs).toHaveBeenCalledTimes(2);
  });

  it("re-fetches immediately when the sort dropdown changes", async () => {
    jobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    renderPage();
    await waitFor(() => expect(jobsService.getJobs).toHaveBeenCalledTimes(1));

    await userEvent.selectOptions(screen.getByDisplayValue("Todas"), "salary");

    await waitFor(() => {
      expect(jobsService.getJobs).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "salary,desc" }));
    });
  });

  it("re-fetches immediately when the remote toggle changes", async () => {
    jobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    renderPage();
    await waitFor(() => expect(jobsService.getJobs).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getAllByRole("button", { name: "Apenas remoto" })[0]);

    await waitFor(() => {
      expect(jobsService.getJobs).toHaveBeenLastCalledWith(expect.objectContaining({ remote: true }));
    });
  });
});
