import { Button } from "../../components/Button/Button";
import seta from "../../assets/back-button-register.png";
import { Typography } from "../../components/Typography/Typography";
import { RegisterForm } from "./RegisterForm";

const currentYear = new Date().getFullYear();

const graduationYears = Array.from(
  { length: currentYear - 1987 + 1 },
  (_, index) => {
    const year = 1987 + index;
    return { id: year, name: year };
  },
);

const modalities = [
  { id: 1, name: "Integrado" },
  { id: 2, name: "Subsequente" },
  { id: 3, name: "Superior" },
];

const campus = [
  { id: 1, name: "Imperatriz" },
  { id: 2, name: "Açailandia" },
  { id: 3, name: "Buriticupu" },
  { id: 4, name: "Monte Castelo" },
  { id: 5, name: "Porto Franco" },
  { id: 6, name: "Barreirinhas" },
];

export function Register() {
  return (
    <div className="bg-dark-green min-h-screen py-24">
      <div className="max-w-[1024px] w-[90%] bg-biege mx-auto flex flex-col rounded-4xl">
        <div className="grid grid-cols-3 items-center mt-12 ml-9">
          <Button variant='icon'>
            <img src={seta} alt="Voltar para a página anterior" />
          </Button>
          <Typography variant="h1">Bem-vindo!</Typography>
        </div>
        <RegisterForm
          modalities={modalities}
          graduationYears={graduationYears}
          campus={campus}
        />
      </div>
      <RegisterForm
        modalities={modalities}
        graduationYears={graduationYears}
        campus={campus}
      />
    </div>
  );
}
