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
    render(<ConnectionBanner own={[academicProfile()]} other={[academicProfile()]} mutualConnectionsCount={5} />);

    expect(screen.getByText(/Mesmo curso e campus/)).toBeInTheDocument();
  });

  it("hides the badge when course or campus differ", () => {
    render(
      <ConnectionBanner
        own={[academicProfile()]}
        other={[academicProfile({ courseName: "Engenharia Civil" })]}
        mutualConnectionsCount={5}
      />
    );

    expect(screen.queryByText(/Mesmo curso e campus/)).not.toBeInTheDocument();
  });

  it("hides the badge when either profile has no academic data", () => {
    render(<ConnectionBanner own={[]} other={[]} mutualConnectionsCount={5} />);

    expect(screen.queryByText(/Mesmo curso e campus/)).not.toBeInTheDocument();
  });

  it("always shows the mock mutual connections count", () => {
    render(<ConnectionBanner own={[]} other={[]} mutualConnectionsCount={5} />);

    expect(screen.getByText("5 conexões em comum")).toBeInTheDocument();
  });
});
