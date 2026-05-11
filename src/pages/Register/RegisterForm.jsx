import { useState } from "react";
import { InputField } from "../../components/InputField/InputField";
import { FormField } from "../../components/FormField/FormField";
import { Label } from "../../components/Label/Label";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";

const coursesByModality = {
  1: [
    { id: 1, name: "Edificações" },
    { id: 2, name: "Eletromecânica" },
    { id: 3, name: "Meio Ambiente" },
    { id: 4, name: "Química" },
    { id: 5, name: "Informática" },
    { id: 6, name: "Segurança do Trabalho" },
  ],
  2: [
    { id: 7, name: "Alimentos" },
    { id: 8, name: "Automação Industrial" },
    { id: 9, name: "Edificações" },
    { id: 10, name: "Eletromecânica" },
    { id: 11, name: "Eletrotécnica" },
    { id: 12, name: "Meio Ambiente" },
    { id: 13, name: "Química" },
    { id: 14, name: "Segurança do Trabalho" },
  ],
  3: [
    { id: 15, name: "Ciência da Computação" },
    { id: 16, name: "Engenharia Elétrica" },
    { id: 17, name: "Engenharia Civil" },
    { id: 18, name: "Física" },
  ],
};

export function RegisterForm({ modalities, graduationYears, campus }) {
  const [selectedModality, setSelectedModality] = useState("");
  const [graduationYear, setGraduationYear] = useState("");

  const availableCourses = coursesByModality[selectedModality] ?? [];

  const entryYears = graduationYear
    ? graduationYears.filter((y) => y.id < +graduationYear)
    : graduationYears;

  return (
    <form action="" className="flex flex-col">
      <div className="grid grid-cols-2 px-20 gap-6 mt-6">

        <FormField>
          <Label htmlFor="name">Nome completo</Label>
          <InputField type="text" id="name" placeholder="Digite o nome" name="name" required />
        </FormField>
        <FormField>
          <Label htmlFor="cpf">CPF</Label>
          <InputField type="text" id="cpf" name="cpf" placeholder="000.000.000-00" inputMode="numeric" maxLength={14} autoComplete="off" required />
        </FormField>

        <FormField>
          <Label htmlFor="email">Email pessoal</Label>
          <InputField type="email" id="email" name="email" placeholder="exemplo@email.com" autoComplete="email" maxLength={50} required />
        </FormField>
        <FormField>
          <Label htmlFor="campus">Campus</Label>
          <Dropdown items={campus} id="campus" name="campus" bordered required />
        </FormField>

        <FormField>
          <Label htmlFor="modality">Modalidade</Label>
          <Dropdown
            items={modalities}
            id="modality"
            name="modality"
            bordered
            onChange={(e) => setSelectedModality(+e.target.value)}
          />
        </FormField>
        <FormField>
          <Label htmlFor="lastCourse">Último curso realizado</Label>
          <Dropdown
            items={availableCourses}
            id="lastCourse"
            name="lastCourse"
            disabled={!selectedModality}
            bordered
            required
          />
        </FormField>

        <FormField>
          <Label htmlFor="graduationYear">Ano de finalização</Label>
          <Dropdown
            items={graduationYears}
            id="graduationYear"
            name="graduationYear"
            onChange={(e) => setGraduationYear(e.target.value)}
            bordered
            required
          />
        </FormField>
        <FormField>
          <Label htmlFor="yearEntry">Ano de ingresso (do último curso finalizado)</Label>
          <Dropdown
            items={entryYears}
            id="yearEntry"
            name="yearEntry"
            disabled={!graduationYear}
            bordered
            required
          />
        </FormField>

      </div>

      <div className="flex flex-col gap-4 w-[260px] items-center mx-auto font-semibold">
        <Button variant="primary" type="submit">Cadastrar-se</Button>
        <Typography variant="p">
          Já possui conta? <a className="text-green" href="#">Entrar</a>
        </Typography>
      </div>
    </form>
  );
}