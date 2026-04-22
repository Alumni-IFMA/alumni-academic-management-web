import { Dropdown } from "../../components/Dropdown/Dropdown.jsx";
import { Navbar } from "../../components/Navbar/navbar.jsx";
import { SearchBar } from "../../components/SearchBar/SearchBar.jsx";
import { Typography } from "../../components/Typography/Typography.jsx";
import { FilterCard } from "../../components/FilterCard/FilterCard.jsx";
import { useState } from "react";

const categories = [
  { id: "all", name: "Todas" },
  { id: "recent", name: "Mais Recentes" },
  { id: "relevant", name: "Mais Relevantes" },
  { id: "salary", name: "Maior Salário" },
];

export function Opportunities() {
  const [search, setSearch] = useState("");

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
      <div className="mt-6 px-11 flex gap-6 items-start">
        <FilterCard />
        {/* cards de vagas virão aqui */}
      </div>
    </div>
  );
}