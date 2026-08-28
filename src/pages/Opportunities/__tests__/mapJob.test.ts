import { describe, it, expect, vi, afterEach } from "vitest";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { mapJob } from "../mapJob";
import type { JobRawDto } from "../../../services/jobsService";

describe("mapJob", () => {
  afterEach(() => vi.useRealTimers());

  it("maps a JobResponseDTO into the shape JobCard/JobDetail expect", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 7, 3, 12, 0, 0));

    const dto: JobRawDto = {
      id: 2,
      title: "Desenvolvedor Java",
      company: "Empresa Supermercado carvalho",
      companyLogoUrl: "https://empresa.com/logo.png",
      description: "Vaga para desenvolvedor Java Sênior",
      location: "São Paulo, SP",
      workplaceType: "HYBRID",
      experienceLevel: "SENIOR",
      requirements: ["Java", "Spring"],
      benefits: ["VR"],
      createdAt: [2026, 8, 1, 17, 49, 56, 105229000],
    };

    const expectedDate = new Date(2026, 7, 1, 17, 49, 56, 105);
    const rawExpectedPostedAt = formatDistanceToNow(expectedDate, { locale: ptBR, addSuffix: true });
    const expectedPostedAt = rawExpectedPostedAt.charAt(0).toUpperCase() + rawExpectedPostedAt.slice(1);

    const result = mapJob(dto);

    expect(result).toEqual({
      id: 2,
      companyName: "Empresa Supermercado carvalho",
      companyLogo: "https://empresa.com/logo.png",
      title: "Desenvolvedor Java",
      location: "São Paulo, SP",
      postedAt: expectedPostedAt,
      description: "Vaga para desenvolvedor Java Sênior",
      tags: ["Híbrido", "Sênior"],
      requirements: ["Java", "Spring"],
      benefits: ["VR"],
    });
  });

  it("omits missing workplaceType/experienceLevel tags gracefully", () => {
    const dto: JobRawDto = {
      id: 3,
      title: "Dev",
      company: "Empresa",
      companyLogoUrl: "",
      description: "",
      location: "",
      workplaceType: null,
      experienceLevel: null,
      requirements: [],
      benefits: [],
      createdAt: [2026, 8, 1, 0, 0, 0, 0],
    };

    const result = mapJob(dto);

    expect(result.tags).toEqual([]);
  });

  it("defaults requirements/benefits to empty arrays when absent", () => {
    const dto: JobRawDto = {
      id: 4,
      title: "Dev",
      company: "Empresa",
      companyLogoUrl: "",
      description: "",
      location: "",
      workplaceType: "REMOTE",
      experienceLevel: "JUNIOR",
      createdAt: [2026, 8, 1, 0, 0, 0, 0],
    };

    const result = mapJob(dto);

    expect(result.requirements).toEqual([]);
    expect(result.benefits).toEqual([]);
  });
});
