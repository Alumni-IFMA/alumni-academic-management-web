import { useEffect, useState } from "react";
import { Button } from "../../components/Button/Button";
import seta from "../../assets/back-button-register.png";
import { Typography } from "../../components/Typography/Typography";
import { RegisterForm } from "./RegisterForm";
import campusCourseService from "../../services/campusCourseService";

const currentYear = new Date().getFullYear();

const graduationYears = Array.from(
  { length: currentYear - 1987 + 1 },
  (_, index) => {
    const year = 1987 + index;
    return { id: year, name: year };
  },
);

export function Register() {
  const [campusCourses, setCampusCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    campusCourseService
      .getAll()
      .then(setCampusCourses)
      .catch(() =>
        setLoadError("Não foi possível carregar os cursos. Recarregue a página.")
      )
      .finally(() => setIsLoading(false));
  }, []);

  const campusNames = campusCourses.map((cc) => cc.campusName); 
  const uniqueCampusNames = [...new Set(campusNames)];
  const campuses = uniqueCampusNames.map((name) => ({ id: name, name }));

  return (
    <div>
      <div className="grid grid-cols-3 items-center mt-12 ml-9">
        <Button variant="icon">
          <img src={seta} alt="Voltar para a página anterior" />
        </Button>
        <Typography variant="h1">Bem-vindo!</Typography>
      </div>

      {loadError && (
        <Typography variant="p" className="text-red-600 text-center mt-4">
          {loadError}
        </Typography>
      )}

      <RegisterForm
        campusCourses={campusCourses}
        campuses={campuses}
        graduationYears={graduationYears}
        disabled={isLoading}
      />
    </div>
  );
}