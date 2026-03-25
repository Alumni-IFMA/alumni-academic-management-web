import { Button } from "../../components/Button/Button";
import seta from "../../assets/back-button-register.png";
import { Typography } from "../../components/Typography/Typography";
import { RegisterForm } from "./RegisterForm";

const graduationYears = Array.from({ length: 2025 - 1987 + 1 }, (_, index) => {
  const year = 1987 + index;
  return {
    id: year,
    name: year,
  };
});

export function Register() {
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

  return (
    <div className="bg-dark-green h-screen">
      <div className="max-w-[1024px] bg-biege mx-auto flex flex-col rounded-4xl">
        <div className="flex gap-60 mt-12 ml-9">
          <Button>
            <img src={seta} alt="Voltar para a página anterior" />
          </Button>
          <Typography variant="h1">Bem-vindo!</Typography>
        </div>
        <RegisterForm
          modalities={modalities}
          graduationYears={graduationYears}
          campus={campus}
        ></RegisterForm>
      </div>
    </div>
  );
}
