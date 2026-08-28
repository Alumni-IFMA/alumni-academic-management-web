import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import seta from "../../assets/back-button-register.png";
import { Typography } from "../../components/Typography/Typography";
import { RegisterForm } from "./RegisterForm";
import campusCourseService, { type CampusCourse } from "../../services/campusCourseService";

const currentYear = new Date().getFullYear();

const graduationYears = Array.from(
  { length: currentYear - 1987 + 1 },
  (_, index) => {
    const year = 1987 + index;
    return { id: year, name: year };
  },
);

export function Register() {
  const navigate = useNavigate();
  const [campusCourses, setCampusCourses] = useState<CampusCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

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
    <div className="relative">
      <Button
        variant="icon"
        onClick={() => navigate(-1)}
        className="absolute -top-2 -left-2 !w-10 !h-10"
      >
        <img src={seta} alt="Voltar para a página anterior" className="w-5 h-5" />
      </Button>

      <div className="text-center mt-4">
        <Typography variant="h1" className="!text-3xl">Bem-vindo!</Typography>
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