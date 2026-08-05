import { useEffect, useMemo, useState } from "react";
import { Dropdown } from "../../components/Dropdown/Dropdown.jsx";
import { Navbar } from "../../components/Navbar/navbar.jsx";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { Typography } from "../../components/Typography/Typography.jsx";
import { FilterCard } from "../../components/FilterCard/FilterCard.jsx";
import { JobCard } from "../../components/JobCard/JobCard.jsx";
import { JobDetail } from "../../components/JobDetail/JobDetail.jsx";
import { OpportunitiesRibbon } from "./components/OpportunitiesRibbon";
import { SlidersHorizontal } from "lucide-react";
import { getJobs, getJobById } from "../../services/jobsService";
import { mapJob } from "./mapJob";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

const PAGE_SIZE = 10;
const DEBOUNCE_MS = 400;

const SORT_OPTIONS = [
  { id: "all", name: "Todas" },
  { id: "recent", name: "Mais Recentes" },
  { id: "salary", name: "Maior Salário" },
];

const SORT_PARAMS = {
  all: undefined,
  recent: "createdAt,desc",
  salary: "salary,desc",
};

export function Opportunities() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [area, setArea] = useState("");
  const [experience, setExperience] = useState([]);
  const [remoteOnly, setRemoteOnly] = useState(false);
  const [sort, setSort] = useState("all");
  const [filterOpen, setFilterOpen] = useState(false);

  const debouncedKeyword = useDebouncedValue(keyword, DEBOUNCE_MS);
  const debouncedLocation = useDebouncedValue(location, DEBOUNCE_MS);

  const filters = useMemo(
    () => ({
      keyword: debouncedKeyword || undefined,
      location: debouncedLocation || undefined,
      area: area || undefined,
      experience: experience.length ? experience : undefined,
      remote: remoteOnly || undefined,
      sort: SORT_PARAMS[sort],
    }),
    [debouncedKeyword, debouncedLocation, area, experience, remoteOnly, sort]
  );

  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadError, setLoadError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJobLoading, setSelectedJobLoading] = useState(false);
  const [selectedJobError, setSelectedJobError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);

    getJobs({ ...filters, page: 0, size: PAGE_SIZE })
      .then((data) => {
        if (cancelled) return;
        const mapped = data.content.map(mapJob);
        setJobs(mapped);
        setPage(0);
        setIsLastPage(data.last);
        setSelectedJob(mapped[0] ?? null);
      })
      .catch(() => {
        if (!cancelled) setLoadError("Não foi possível carregar as vagas.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [filters]);

  function handleLoadMore() {
    if (loadingMore || isLastPage) return;

    const nextPage = page + 1;
    setLoadingMore(true);

    getJobs({ ...filters, page: nextPage, size: PAGE_SIZE })
      .then((data) => {
        setJobs((prev) => [...prev, ...data.content.map(mapJob)]);
        setPage(nextPage);
        setIsLastPage(data.last);
      })
      .catch(() => setLoadError("Não foi possível carregar mais vagas."))
      .finally(() => setLoadingMore(false));
  }

  function handleListScroll(e) {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 100) {
      handleLoadMore();
    }
  }

  function handleSelectJob(job) {
    setSelectedJob(job);
    setSelectedJobError(null);
    setSelectedJobLoading(true);

    getJobById(job.id)
      .then((dto) => setSelectedJob(mapJob(dto)))
      .catch(() => setSelectedJobError("Não foi possível carregar os detalhes da vaga."))
      .finally(() => setSelectedJobLoading(false));
  }

  function toggleExperience(id) {
    setExperience((prev) => (prev.includes(id) ? prev.filter((e) => e !== id) : [...prev, id]));
  }

  function handleSearch() {}

  const filterCardProps = {
    location,
    onLocationChange: setLocation,
    area,
    onAreaChange: setArea,
    experience,
    onExperienceToggle: toggleExperience,
    remoteOnly,
    onRemoteOnlyChange: setRemoteOnly,
  };

  return (
     <div className="relative overflow-hidden font-poppins">
      <OpportunitiesRibbon />
      <Navbar />

      <div className="relative z-10 max-w-7xl mx-auto">
      <div className="pt-24 px-6 md:px-12">
        <Typography variant="h1">Encontre oportunidades</Typography>
        <Typography variant="p">
          Explore e encontre uma vaga perfeita para você.
        </Typography>
      </div>

      <div className="mt-6 flex gap-4 items-center px-6 md:px-12">
        {/* Botão de filtro — visível apenas quando FilterCard está oculto */}
        <button
          onClick={() => setFilterOpen(true)}
          className="2xl:hidden flex items-center gap-2 border border-dark-green text-dark-green px-4 py-2 rounded-full text-sm font-medium shrink-0"
        >
          <SlidersHorizontal size={16} /> Filtros
        </button>

        <SearchBar
          className="w-[65%]"
          placeholder="Procure por oportunidades"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          onSearch={handleSearch}
        />
        <Dropdown
          className="w-[35%] rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          items={SORT_OPTIONS}
          value={sort}
          onChange={(e) => setSort(e.target.value)}
        />
      </div>

      {/* Conteúdo principal */}
      <div className="mt-6 px-6 md:px-12 flex gap-4 items-start pb-11">

        {/* FilterCard fixo em telas grandes */}
        <div className="hidden 2xl:block w-[28%] shrink-0">
          <FilterCard {...filterCardProps} />
        </div>

        {/* Drawer de filtros para telas menores */}
        {filterOpen && (
          <div className="fixed inset-0 z-50 flex 2xl:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setFilterOpen(false)}
            />
            {/* Painel */}
            <div className="relative z-10 bg-white h-full w-[400px] p-6 overflow-y-auto shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="font-semibold text-lg">Filtros</span>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl font-bold"
                >
                  ✕
                </button>
              </div>
              <FilterCard hideTitle {...filterCardProps} />
            </div>
          </div>
        )}

        {/* Lista de vagas */}
        <div
          data-testid="job-list"
          onScroll={handleListScroll}
          className="flex flex-col gap-4 w-[50%] 2xl:w-[30%] shrink-0 overflow-y-auto max-h-[70vh]"
        >
          {loading && (
            <div className="flex flex-col gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-100 rounded-2xl h-40 animate-pulse" />
              ))}
            </div>
          )}

          {!loading && loadError && <p className="text-red-500 text-sm">{loadError}</p>}

          {!loading && !loadError && jobs.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhuma vaga encontrada com esses filtros.</p>
          )}

          {!loading && !loadError && jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              onClick={() => handleSelectJob(job)}
            />
          ))}

          {!loading && !loadError && loadingMore && (
            <p className="text-center text-sm text-gray-400 py-2">Carregando mais vagas...</p>
          )}
        </div>

        {/* Detalhe da vaga */}
        <JobDetail job={selectedJob} loading={selectedJobLoading} error={selectedJobError} />
      </div>
      </div>

      <footer className="relative z-10 py-6 px-8 text-center text-sm text-gray-500">
        © 2026 Equipe alumni IFMA • Feito com carinho para a comunidade
      </footer>
    </div>
  );
}
