import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ConnectionBanner } from "../ConnectionBanner";
import type { AcademicProfileDto } from "../../../../services/userService";

function academicProfile(overrides: Partial<AcademicProfileDto> = {}): AcademicProfileDto {
  return {
    id: 1,
    entryYear: 2018,
    conclusionYear: 2022,
    campusName: "Campus São Luís",
    courseName: "ADS",
    level: "GRADUACAO",
    modality: "BACHARELADO",
    ...overrides,
  };
}

describe("ConnectionBanner", () => {
  it("shows the same course/campus badge when own and other profiles match", () => {
    render(<ConnectionBanner own={[academicProfile()]} other={[academicProfile()]} />);

    expect(screen.getByText(/Mesmo curso e campus/)).toBeInTheDocument();
  });

  it("hides the badge when course or campus differ", () => {
    render(
      <ConnectionBanner own={[academicProfile()]} other={[academicProfile({ courseName: "Engenharia Civil" })]} />
    );

    expect(screen.queryByText(/Mesmo curso e campus/)).not.toBeInTheDocument();
  });

  it("hides the badge when either profile has no academic data", () => {
    render(<ConnectionBanner own={[]} other={[]} />);

    expect(screen.queryByText(/Mesmo curso e campus/)).not.toBeInTheDocument();
  });

  it("matches across all academic profiles, not just the first one on each side", () => {
    // own's second profile matches other's first profile — a same-index-only
    // comparison would miss this.
    render(
      <ConnectionBanner
        own={[academicProfile({ id: 1, courseName: "Redes de Computadores" }), academicProfile({ id: 2 })]}
        other={[academicProfile({ id: 3 })]}
      />
    );

    expect(screen.getByText(/Mesmo curso e campus/)).toBeInTheDocument();
  });

  it("renders nothing (not even an empty banner) when there is no match", () => {
    const { container } = render(<ConnectionBanner own={[]} other={[]} />);

    expect(container).toBeEmptyDOMElement();
  });
});
