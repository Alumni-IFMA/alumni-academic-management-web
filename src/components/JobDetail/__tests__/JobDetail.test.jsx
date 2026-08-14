import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { JobDetail } from "../JobDetail";

const job = {
  id: 1,
  companyName: "Empresa",
  companyLogo: "",
  title: "Dev Backend",
  location: "Remoto",
  postedAt: "Há 2 dias",
  description: "Descrição da vaga",
  tags: ["Remoto", "Sênior"],
  requirements: ["React"],
  benefits: ["VR"],
};

describe("JobDetail", () => {
  it("shows a placeholder when no job is selected", () => {
    render(<JobDetail job={null} />);
    expect(screen.getByText("Selecione uma vaga para ver os detalhes.")).toBeInTheDocument();
  });

  it("shows a loading state", () => {
    render(<JobDetail job={null} loading />);
    expect(screen.getByText("Carregando detalhes...")).toBeInTheDocument();
  });

  it("shows an error state", () => {
    render(<JobDetail job={null} error="Não foi possível carregar os detalhes da vaga." />);
    expect(screen.getByText("Não foi possível carregar os detalhes da vaga.")).toBeInTheDocument();
  });

  it("renders the job details when provided", () => {
    render(<JobDetail job={job} />);
    expect(screen.getByText("Dev Backend")).toBeInTheDocument();
    expect(screen.getByText("Empresa")).toBeInTheDocument();
    expect(screen.getByText("Descrição da vaga")).toBeInTheDocument();
    expect(screen.getByText("React")).toBeInTheDocument();
    expect(screen.getByText("VR")).toBeInTheDocument();
  });

  it("prioritizes loading over a selected job", () => {
    render(<JobDetail job={job} loading />);
    expect(screen.getByText("Carregando detalhes...")).toBeInTheDocument();
    expect(screen.queryByText("Dev Backend")).not.toBeInTheDocument();
  });
});
