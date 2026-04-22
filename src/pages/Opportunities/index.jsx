import { Dropdown } from "../../components/Dropdown/Dropdown.jsx";
import { Navbar } from "../../components/Navbar/navbar.jsx";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { Typography } from "../../components/Typography/Typography.jsx";
import { FilterCard } from "../../components/FilterCard/FilterCard.jsx";
import { JobCard } from "../../components/JobCard/JobCard.jsx";
import { useState } from "react";
import { JobDetail } from "../../components/JobDetail/JobDetail.jsx";

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
    title: "Desenvolvedor(a) Frontend Sênior",
    location: "São Paulo",
    postedAt: "Há 10 dias",
    description: "A Microsoft está em busca de uma pessoa Desenvolvedora Frontend Sênior para atuar na criação e evolução de interfaces modernas, acessíveis e escaláveis. Você fará parte de um time multidisciplinar responsável por desenvolver soluções web utilizadas por milhares de usuários diariamente, com foco em performance, qualidade e experiência do usuário. Buscamos alguém com forte domínio de tecnologias frontend, boas práticas de arquitetura e experiência em ambientes ágeis, que goste de trabalhar em equipe e contribuir com decisões técnicas importantes.",
    tags: ["Remoto"],
    requirements: ["React / TypeScript", "CSS / Tailwind", "Git / GitHub", "Inglês intermediário"],
    benefits: ["Plano de Saúde", "VA / VR", "Home office", "Vale transporte"],
  },
  {
    id: 2,
    companyName: "Alumni IFMA",
    companyLogo: "",
    title: "Engenheiro(a) de Software Pleno",
    location: "Imperatriz - MA",
    postedAt: "Há 2 dias",
    description: "Estamos em busca de uma pessoa Desenvolvedora Java para se juntar ao nosso time! Procuramos alguém com experiência sólida em Java e Spring Boot, capaz de atuar no desenvolvimento e manutenção de aplicações escaláveis e de alta performance. É fundamental ter vivência com arquitetura orientada a eventos, utilização de Kafka para mensageria e comunicação entre sistemas, além de testes automatizados, garantindo qualidade e confiabilidade no código.",
    tags: ["Híbrido", "Pleno"],
    requirements: ["Java 17+ / Spring Boot", "Kafka / Mensageria", "JUnit, Mockito, Testcontainers", "AWS (S3, SQS)"],
    benefits: ["Plano de Saúde", "VA / VR", "Home office", "Vale transporte", "Day off aniversário"],
  },
  {
    id: 3,
    companyName: "Google",
    companyLogo: google,
    title: "Engenheiro(a) de Software Sênior",
    location: "Imperatriz - MA",
    postedAt: "Há 2 dias",
    description: "A Google está buscando uma pessoa Engenheira de Software Backend com experiência em Golang (Go) para atuar no desenvolvimento de serviços distribuídos de alta escala. Você fará parte de um time responsável por criar soluções robustas e performáticas, garantindo disponibilidade, segurança e qualidade para milhões de usuários. Procuramos alguém com perfil colaborativo, domínio em sistemas backend e interesse em trabalhar com arquitetura moderna baseada em microsserviços e infraestrutura em nuvem.",
    tags: ["Híbrido", "Pleno"],
    requirements: ["Go / Python", "Kubernetes / Docker", "GCP", "Inglês avançado"],
    benefits: ["Plano de Saúde", "VA / VR", "Home office"],
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
        <JobDetail job={selectedJob} />
      </div>
    </div>
  );
}