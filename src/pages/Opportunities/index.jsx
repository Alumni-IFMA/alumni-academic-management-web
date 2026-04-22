import { Dropdown } from "../../components/Dropdown/Dropdown.jsx";
import { Navbar } from "../../components/Navbar/navbar.jsx";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { Typography } from "../../components/Typography/Typography.jsx";
import { FilterCard } from "../../components/FilterCard/FilterCard.jsx";
import { JobCard } from "../../components/JobCard/JobCard.jsx";
import { useState } from "react";

import microsoft from "../../assets/microsoft.png";
import google from "../../assets/google.png";

const categories = [
  { id: "all", name: "Todas" },
  { id: "recent", name: "Mais Recentes" },
  { id: "relevant", name: "Mais Relevantes" },
  { id: "salary", name: "Maior Salário" },
];

const mockJobs = [
  {
    id: 1,
    companyName: "Microsoft",
    companyLogo: microsoft,
    title: "Desenvolvedor Frontend Pleno",
    location: "São Paulo",
    postedAt: "Há 10 dias",
    description: "Estamos em busca de uma pessoa Desenvolvedora Frontend para se juntar ao nosso time!",
    tags: ["Remoto"],
  },
  {
    id: 2,
    companyName: "Alumni IFMA",
    companyLogo: "",
    title: "Engenheiro(a) de Software Pleno",
    location: "Imperatriz - MA",
    postedAt: "Há 2 dias",
    description: "Estamos em busca de uma pessoa Desenvolvedora Java para se juntar ao nosso time!",
    tags: ["Híbrido", "Pleno"],
  },
  {
    id: 3,
    companyName: "Google",
    companyLogo: google,
    title: "Engenheiro(a) de Software Pleno",
    location: "Imperatriz - MA",
    postedAt: "Há 2 dias",
    description: "Estamos em busca de uma pessoa Desenvolvedora Java para se juntar ao nosso time!",
    tags: ["Híbrido", "Pleno"],
  },
];

export function Opportunities() {
  const [search, setSearch] = useState("");
  const [selectedJob, setSelectedJob] = useState(mockJobs[0]);

  function handleSearch() {
    console.log("Pesquisar por:", search);
  }

  return (
    <div className="font-poppins">
      <Navbar />

      <div className="mt-11 ml-11">
        <Typography variant="h1">Encontre oportunidades</Typography>
        <Typography variant="p">
          Explore e encontre uma vaga perfeita para você.
        </Typography>
      </div>

      <div className="mt-6 flex gap-4 items-center px-11">
        <SearchBar
          className="w-[60%]"
          placeholder="Procure por oportunidades"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onSearch={handleSearch}
        />
        <Dropdown
          className="w-[30%] rounded-4xl shadow-[0_4px_12px_rgba(0,0,0,0.12)]"
          items={categories}
          defaultValue="all"
        />
      </div>

      {/* Conteúdo principal */}
      <div className="mt-6 px-11 flex gap-6 items-start pb-11">
        <FilterCard />

        {/* Lista de vagas */}
        <div className="flex flex-col gap-4 w-[580px] overflow-y-auto max-h-[70vh]">
          {mockJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              isSelected={selectedJob?.id === job.id}
              onClick={() => setSelectedJob(job)}
            />
          ))}
        </div>

        {/* Detalhe da vaga */}
        <div className="flex-1 bg-white rounded-2xl shadow-md p-6 min-h-[300px]">
          <p className="text-gray-400 text-sm">Selecione uma vaga para ver os detalhes.</p>
        </div>
      </div>
    </div>
  );
}