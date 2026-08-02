import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "../../components/Button/Button";
import { Typography } from "../../components/Typography/Typography";
import { Dropdown } from "../../components/Dropdown/Dropdown";
import { getMyDegrees } from "../../services/degreeService";

export function Diploma() {
  const navigate = useNavigate();
  const [degrees, setDegrees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [selectedDegreeId, setSelectedDegreeId] = useState("");

  useEffect(() => {
    getMyDegrees()
      .then(setDegrees)
      .catch(() => setLoadError("Não foi possível carregar seus cursos."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="icon" onClick={() => navigate(-1)} aria-label="Voltar">
          <ArrowLeft className="text-dark-green" size={24} />
        </Button>
        <Typography variant="h1">Baixe seu diploma</Typography>
      </div>

      <div className="bg-white rounded-3xl shadow-sm p-6 sm:p-8">
        {loading && <div className="h-14 rounded-lg bg-gray-100 animate-pulse" />}

        {!loading && loadError && <p className="text-red-500 text-sm">{loadError}</p>}

        {!loading && !loadError && degrees.length === 0 && (
          <p className="text-red-500 text-sm">Você ainda não possui diploma disponível.</p>
        )}

        {!loading && !loadError && degrees.length > 0 && (
          <>
            <label className="block text-dark-green font-semibold mb-2" htmlFor="degree-select">
              Curso:
            </label>
            <Dropdown
              id="degree-select"
              items={degrees.map((d) => ({ id: d.id, name: d.title }))}
              value={selectedDegreeId}
              onChange={(e) => setSelectedDegreeId(e.target.value)}
              bordered
              className="mb-6"
            />
          </>
        )}
      </div>
    </div>
  );
}
