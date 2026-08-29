import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import { Diploma } from "../index";
import * as degreeService from "../../../services/degreeService";
import type { Degree } from "../../../services/degreeService";

vi.mock("../../../services/degreeService");

const mockedDegreeService = degreeService as Mocked<typeof degreeService>;

const mockDegrees: Degree[] = [
  { id: 1, title: "Bacharelado em Ciência da Computação", userId: 10, fileUrl: "http://minio/diplomas/1.pdf" },
  { id: 2, title: "Técnico em Informática", userId: 10, fileUrl: "" },
];

function renderDiploma() {
  return render(
    <MemoryRouter initialEntries={["/diploma"]}>
      <Diploma />
    </MemoryRouter>
  );
}

describe("Diploma page", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the title and a back button", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    renderDiploma();
    expect(screen.getByText("Baixe seu diploma")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /voltar/i })).toBeInTheDocument();
    await waitFor(() => expect(mockedDegreeService.getMyDegrees).toHaveBeenCalled());
  });

  it("shows the course dropdown populated after loading", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    renderDiploma();
    await waitFor(() => {
      expect(screen.getByText("Bacharelado em Ciência da Computação")).toBeInTheDocument();
      expect(screen.getByText("Técnico em Informática")).toBeInTheDocument();
    });
  });

  it("shows an error message when loading degrees fails", async () => {
    mockedDegreeService.getMyDegrees.mockRejectedValue(new Error("network error"));
    renderDiploma();
    await waitFor(() => {
      expect(screen.getByText("Não foi possível carregar seus cursos.")).toBeInTheDocument();
    });
  });

  it("shows an empty state message when the user has no degrees", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue([]);
    renderDiploma();
    await waitFor(() => {
      expect(screen.getByText("Você ainda não possui diploma disponível.")).toBeInTheDocument();
    });
  });

  it("disables the download button until a course is selected", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    renderDiploma();
    await waitFor(() => screen.getByText("Bacharelado em Ciência da Computação"));
    expect(screen.getByRole("button", { name: /^baixar$/i })).toBeDisabled();
  });

  it("downloads the diploma when the selected course has a fileUrl", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    mockedDegreeService.getDownloadUrl.mockResolvedValue("http://minio/diplomas/1.pdf?X-Amz-Signature=xyz");
    const fakeWindow = { location: { href: "" }, opener: "not-null", close: vi.fn() };
    const openSpy = vi.spyOn(window, "open").mockReturnValue(fakeWindow as unknown as Window);

    renderDiploma();
    await waitFor(() => screen.getByText("Bacharelado em Ciência da Computação"));

    await userEvent.selectOptions(screen.getByLabelText("Curso:"), "1");
    await userEvent.click(screen.getByRole("button", { name: /^baixar$/i }));

    await waitFor(() => {
      expect(openSpy).toHaveBeenCalledWith("", "_blank");
      expect(mockedDegreeService.getDownloadUrl).toHaveBeenCalledWith(1);
      expect(fakeWindow.location.href).toBe("http://minio/diplomas/1.pdf?X-Amz-Signature=xyz");
      expect(fakeWindow.opener).toBeNull();
    });

    openSpy.mockRestore();
  });

  it("shows an error and skips the download call when the popup is blocked", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    const openSpy = vi.spyOn(window, "open").mockReturnValue(null);

    renderDiploma();
    await waitFor(() => screen.getByText("Bacharelado em Ciência da Computação"));

    await userEvent.selectOptions(screen.getByLabelText("Curso:"), "1");
    await userEvent.click(screen.getByRole("button", { name: /^baixar$/i }));

    await waitFor(() => {
      expect(screen.getByText("Não foi possível abrir a aba de download. Verifique o bloqueador de pop-ups.")).toBeInTheDocument();
    });
    expect(mockedDegreeService.getDownloadUrl).not.toHaveBeenCalled();

    openSpy.mockRestore();
  });

  it("shows an error and skips the download call when the selected course has no fileUrl", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);

    renderDiploma();
    await waitFor(() => screen.getByText("Técnico em Informática"));

    await userEvent.selectOptions(screen.getByLabelText("Curso:"), "2");
    await userEvent.click(screen.getByRole("button", { name: /^baixar$/i }));

    await waitFor(() => {
      expect(screen.getByText("Diploma não disponível para este curso.")).toBeInTheDocument();
    });
    expect(mockedDegreeService.getDownloadUrl).not.toHaveBeenCalled();
  });

  it("shows an error message when the download endpoint fails", async () => {
    mockedDegreeService.getMyDegrees.mockResolvedValue(mockDegrees);
    mockedDegreeService.getDownloadUrl.mockRejectedValue(new Error("network error"));
    const fakeWindow = { location: { href: "" }, opener: "not-null", close: vi.fn() };
    const openSpy = vi.spyOn(window, "open").mockReturnValue(fakeWindow as unknown as Window);

    renderDiploma();
    await waitFor(() => screen.getByText("Bacharelado em Ciência da Computação"));

    await userEvent.selectOptions(screen.getByLabelText("Curso:"), "1");
    await userEvent.click(screen.getByRole("button", { name: /^baixar$/i }));

    await waitFor(() => {
      expect(screen.getByText("Não foi possível baixar o diploma. Tente novamente.")).toBeInTheDocument();
      expect(fakeWindow.close).toHaveBeenCalled();
    });

    openSpy.mockRestore();
  });
});
