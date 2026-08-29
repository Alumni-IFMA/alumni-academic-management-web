import { useState } from "react";
/* import { Search } from "lucide-react"; */
import { SearchBar } from "../../../components/SearchBar/SearchBar";

interface HeroSectionProps {
  userName: string | null;
  onSearch: (term: string) => void;
}

export function HeroSection({ userName, onSearch }: HeroSectionProps) {
  const [term, setTerm] = useState("");

  function handleSearch() {
    if (term.trim()) onSearch(term.trim());
  }

  return (
    <section className="relative pt-10 pb-8">
      <h1 className="text-4xl md:text-5xl font-bold text-dark-green mb-3 relative z-10">
        Bem-vindo(a), {userName}!
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-6 relative z-10 whitespace-nowrap">
        Acompanhe oportunidades, notícias e eventos da sua rede{" "}
        <span className="font-bold text-green">Alumni IFMA</span>.
      </p>

      <div className="max-w-lg">
        <SearchBar 
          placeholder="Mentores, egressos e professores"
          value={term} 
          onChange={(e) => setTerm(e.target.value)}
          onSearch={handleSearch}
        />
      </div>

    </section>
  );
}
