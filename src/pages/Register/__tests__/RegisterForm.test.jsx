import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { RegisterForm } from "../RegisterForm";

vi.mock("../../../services/userService", () => ({
  default: { register: vi.fn() },
}));

vi.mock("sonner", () => ({
  toast: { error: vi.fn() },
  Toaster: () => null,
}));

import userService from "../../../services/userService";
import { toast } from "sonner";

const campusCourses = [
  { id: 1, campusName: "Imperatriz", courseName: "Informática", modality: "INTEGRADO" },
  { id: 2, campusName: "Imperatriz", courseName: "Sistemas de Informação", modality: "BACHARELADO" },
];
const campuses = [{ id: "Imperatriz", name: "Imperatriz" }];
const graduationYears = [
  { id: 2023, name: 2023 },
  { id: 2024, name: 2024 },
];

function renderForm() {
  return render(
    <MemoryRouter>
      <RegisterForm
        campusCourses={campusCourses}
        campuses={campuses}
        graduationYears={graduationYears}
      />
    </MemoryRouter>
  );
}

async function fillValidForm(user) {
  await user.type(screen.getByPlaceholderText("Digite o nome"), "Maria Silva");
  await user.type(screen.getByPlaceholderText("000.000.000-00"), "12345678901");
  await user.type(screen.getByPlaceholderText("exemplo@email.com"), "maria@example.com");

  const [campusSelect, modalitySelect, courseSelect, graduationSelect, entrySelect] =
    screen.getAllByRole("combobox");

  await user.selectOptions(campusSelect, "Imperatriz");
  await user.selectOptions(modalitySelect, "INTEGRADO");
  await user.selectOptions(courseSelect, "1");
  await user.selectOptions(graduationSelect, "2024");
  await user.selectOptions(entrySelect, "2023");
}

describe("RegisterForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("exibe erro de validação quando o CPF é inválido", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText("Digite o nome"), "Maria Silva");
    await user.type(screen.getByPlaceholderText("000.000.000-00"), "123");
    await user.click(screen.getByRole("button", { name: /cadastrar-se/i }));

    expect(await screen.findByText("CPF deve conter 11 dígitos")).toBeInTheDocument();
    expect(userService.register).not.toHaveBeenCalled();
  });

  it("exibe erro de validação quando o email é inválido", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByPlaceholderText("exemplo@email.com"), "naoemail");
    await user.click(screen.getByRole("button", { name: /cadastrar-se/i }));

    expect(await screen.findByText("Email inválido")).toBeInTheDocument();
  });

  it("filtra modalidades e cursos ao selecionar o campus", async () => {
    const user = userEvent.setup();
    renderForm();

    const [campusSelect] = screen.getAllByRole("combobox");
    await user.selectOptions(campusSelect, "Imperatriz");

    expect(screen.getByRole("option", { name: "INTEGRADO" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "BACHARELADO" })).toBeInTheDocument();
  });

  it("chama userService.register com o payload correto e mostra mensagem de sucesso", async () => {
    userService.register.mockResolvedValue({ id: 1 });
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /cadastrar-se/i }));

    await waitFor(() =>
      expect(userService.register).toHaveBeenCalledWith(
        expect.objectContaining({
          name: "Maria Silva",
          cpf: "12345678901",
          email: "maria@example.com",
          campusCourseId: 1,
          entryYear: 2023,
          conclusionYear: 2024,
        })
      )
    );
    expect(
      await screen.findByText(/Cadastro realizado! Aguarde a aprovação/i)
    ).toBeInTheDocument();
  });

  it("exibe toast de erro quando a API retorna CPF duplicado", async () => {
    userService.register.mockRejectedValue({
      response: { data: { message: "User already exists" } },
    });
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);
    await user.click(screen.getByRole("button", { name: /cadastrar-se/i }));

    await waitFor(() =>
      expect(toast.error).toHaveBeenCalledWith("User already exists")
    );
  });

  it("desabilita o botão de submit enquanto a requisição está em andamento", async () => {
    userService.register.mockImplementation(
      () => new Promise((resolve) => setTimeout(resolve, 100))
    );
    const user = userEvent.setup();
    renderForm();

    await fillValidForm(user);

    const botao = screen.getByRole("button", { name: /cadastrar-se/i });
    await user.click(botao);

    expect(botao).toBeDisabled();
  });
});