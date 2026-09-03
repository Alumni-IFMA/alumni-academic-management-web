import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi } from "vitest";
import { JobCard } from "../JobCard";

const job = {
  id: 1,
  companyName: "Empresa",
  title: "Dev Backend",
  location: "Remoto",
  postedAt: "Há 2 dias",
  tags: ["Remoto"],
};

describe("JobCard", () => {
  it("calls onToggleSave without triggering onClick when the bookmark is clicked", async () => {
    const onClick = vi.fn();
    const onToggleSave = vi.fn();
    render(<JobCard job={job} onClick={onClick} onToggleSave={onToggleSave} />);

    await userEvent.click(screen.getByRole("button", { name: "Salvar vaga" }));

    expect(onToggleSave).toHaveBeenCalledTimes(1);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("shows the 'remove from saved' label and a filled icon when saved", () => {
    render(<JobCard job={job} saved onToggleSave={vi.fn()} />);

    expect(screen.getByRole("button", { name: "Remover dos salvos" })).toBeInTheDocument();
  });
});
