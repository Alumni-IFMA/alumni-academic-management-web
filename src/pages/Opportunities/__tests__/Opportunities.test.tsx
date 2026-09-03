import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthContext } from "../../../context/AuthContext";
import { Opportunities } from "../index";
import * as jobsService from "../../../services/jobsService";
import type { JobRawDto } from "../../../services/jobsService";
import type { Page } from "../../../services/api";
import type { Mocked } from "vitest";

vi.mock("../../../services/jobsService");

const mockedJobsService = jobsService as Mocked<typeof jobsService>;

function makePage(content: JobRawDto[], overrides: Partial<Page<JobRawDto>> = {}): Page<JobRawDto> {
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
  workplaceType: "HYBRID" as const,
  experienceLevel: "SENIOR" as const,
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
  workplaceType: "REMOTE" as const,
  experienceLevel: "JUNIOR" as const,
  requirements: [],
  benefits: [],
  createdAt: [2026, 8, 1, 12, 0, 0, 0],
};

const fakeAuth = { isAuthenticated: true, userName: "Kenia", userId: 1, login: vi.fn(), logout: vi.fn() };

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
    mockedJobsService.getSavedJobs.mockResolvedValue([]);
  });

  it("loads jobs on mount with no filters", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto, job2Dto]));
    renderPage();

    await waitFor(() => {
      expect(mockedJobsService.getJobs).toHaveBeenCalledWith(expect.objectContaining({ page: 0, size: 10 }));
      // job1 is auto-selected, so it renders in both the list and the detail panel
      expect(screen.getAllByText("Desenvolvedor Java").length).toBeGreaterThan(0);
      expect(screen.getByText("Designer UX")).toBeInTheDocument();
    });
  });

  it("shows an error message when loading fails", async () => {
    mockedJobsService.getJobs.mockRejectedValue(new Error("network error"));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar as vagas.")).toBeInTheDocument();
    });
  });

  it("shows an empty state when there are no matching jobs", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([]));
    renderPage();

    await waitFor(() => {
      expect(screen.getByText("Nenhuma vaga encontrada com esses filtros.")).toBeInTheDocument();
    });
  });

  it("debounces the keyword search before re-fetching", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    renderPage();
    await waitFor(() => expect(mockedJobsService.getJobs).toHaveBeenCalledTimes(1));

    await userEvent.type(screen.getByPlaceholderText("Procure por oportunidades"), "java");

    await waitFor(
      () => {
        expect(mockedJobsService.getJobs).toHaveBeenLastCalledWith(
          expect.objectContaining({ keyword: "java", page: 0 })
        );
      },
      { timeout: 1000 }
    );

    expect(mockedJobsService.getJobs).toHaveBeenCalledTimes(2);
  });

  it("re-fetches immediately when the sort dropdown changes", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    renderPage();
    await waitFor(() => expect(mockedJobsService.getJobs).toHaveBeenCalledTimes(1));

    await userEvent.selectOptions(screen.getByDisplayValue("Todas"), "salary");

    await waitFor(() => {
      expect(mockedJobsService.getJobs).toHaveBeenLastCalledWith(expect.objectContaining({ sort: "salary,desc" }));
    });
  });

  it("re-fetches immediately when the remote toggle changes", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    renderPage();
    await waitFor(() => expect(mockedJobsService.getJobs).toHaveBeenCalledTimes(1));

    await userEvent.click(screen.getAllByRole("button", { name: "Apenas remoto" })[0]);

    await waitFor(() => {
      expect(mockedJobsService.getJobs).toHaveBeenLastCalledWith(expect.objectContaining({ remote: true }));
    });
  });

  it("loads the next page when the job list is scrolled near the bottom", async () => {
    mockedJobsService.getJobs
      .mockResolvedValueOnce(makePage([job1Dto], { totalPages: 2, number: 0, last: false }))
      .mockResolvedValueOnce(makePage([job2Dto], { totalPages: 2, number: 1, last: true }));

    renderPage();
    await waitFor(() => expect(screen.getByText("Desenvolvedor Java")).toBeInTheDocument());

    const list = screen.getByTestId("job-list");
    Object.defineProperty(list, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(list, "clientHeight", { value: 500, configurable: true });
    Object.defineProperty(list, "scrollTop", { value: 950, configurable: true });

    fireEvent.scroll(list);

    await waitFor(() => {
      expect(mockedJobsService.getJobs).toHaveBeenLastCalledWith(expect.objectContaining({ page: 1 }));
      expect(screen.getByText("Designer UX")).toBeInTheDocument();
    });
  });

  it("does not request another page once the last page has been reached", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto], { totalPages: 1, number: 0, last: true }));
    renderPage();
    await waitFor(() => expect(screen.getByText("Desenvolvedor Java")).toBeInTheDocument());

    const list = screen.getByTestId("job-list");
    Object.defineProperty(list, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(list, "clientHeight", { value: 500, configurable: true });
    Object.defineProperty(list, "scrollTop", { value: 950, configurable: true });

    fireEvent.scroll(list);

    await waitFor(() => expect(mockedJobsService.getJobs).toHaveBeenCalledTimes(1));
  });

  it("resets accumulated pages when a filter changes", async () => {
    mockedJobsService.getJobs
      .mockResolvedValueOnce(makePage([job1Dto], { totalPages: 2, number: 0, last: false }))
      .mockResolvedValueOnce(makePage([job2Dto], { totalPages: 2, number: 1, last: true }))
      .mockResolvedValueOnce(makePage([job2Dto], { totalPages: 1, number: 0, last: true }));

    renderPage();
    await waitFor(() => expect(screen.getByText("Desenvolvedor Java")).toBeInTheDocument());

    const list = screen.getByTestId("job-list");
    Object.defineProperty(list, "scrollHeight", { value: 1000, configurable: true });
    Object.defineProperty(list, "clientHeight", { value: 500, configurable: true });
    Object.defineProperty(list, "scrollTop", { value: 950, configurable: true });
    fireEvent.scroll(list);
    await waitFor(() => expect(mockedJobsService.getJobs).toHaveBeenCalledTimes(2));

    await userEvent.selectOptions(screen.getByDisplayValue("Todas"), "salary");

    await waitFor(() => {
      expect(mockedJobsService.getJobs).toHaveBeenLastCalledWith(
        expect.objectContaining({ page: 0, sort: "salary,desc" })
      );
    });
  });

  it("fetches job details on click and shows them in the detail panel", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto, job2Dto]));
    mockedJobsService.getJobById.mockResolvedValue({ ...job2Dto, description: "Descrição completa B" });

    renderPage();
    await waitFor(() => expect(screen.getByText("Designer UX")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Designer UX"));

    await waitFor(() => {
      expect(mockedJobsService.getJobById).toHaveBeenCalledWith(2);
      expect(screen.getByText("Descrição completa B")).toBeInTheDocument();
    });
  });

  it("shows an error in the detail panel when fetching details fails", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto, job2Dto]));
    mockedJobsService.getJobById.mockRejectedValue(new Error("network error"));

    renderPage();
    await waitFor(() => expect(screen.getByText("Designer UX")).toBeInTheDocument());

    await userEvent.click(screen.getByText("Designer UX"));

    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar os detalhes da vaga.")).toBeInTheDocument();
    });
  });

  it("switches to the saved-jobs view and filters it by keyword", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto, job2Dto]));
    mockedJobsService.getSavedJobs.mockResolvedValue([job2Dto]);

    renderPage();
    await waitFor(() => expect(screen.getAllByText("Desenvolvedor Java").length).toBeGreaterThan(0));

    await userEvent.click(screen.getByRole("button", { name: "Salvas" }));

    await waitFor(() => {
      expect(screen.getAllByText("Designer UX").length).toBeGreaterThan(0);
      expect(screen.queryByText("Desenvolvedor Java")).not.toBeInTheDocument();
    });

    await userEvent.type(screen.getByPlaceholderText("Procure por oportunidades"), "zzz");

    await waitFor(() => {
      expect(screen.queryByText("Designer UX")).not.toBeInTheDocument();
    });
  });

  it("toggles a job's saved state from the list", async () => {
    mockedJobsService.getJobs.mockResolvedValue(makePage([job1Dto]));
    mockedJobsService.getSavedJobs.mockResolvedValue([]);
    mockedJobsService.saveJob.mockResolvedValue(undefined);

    renderPage();
    await waitFor(() => expect(screen.getAllByText("Desenvolvedor Java").length).toBeGreaterThan(0));

    await userEvent.click(screen.getByRole("button", { name: "Salvar vaga" }));

    await waitFor(() => expect(mockedJobsService.saveJob).toHaveBeenCalledWith(1));
  });
});
