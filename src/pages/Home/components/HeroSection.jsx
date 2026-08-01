import { useState } from "react";
import { Search } from "lucide-react";

export function HeroSection({ userName, onSearch }) {
  const [term, setTerm] = useState("");

  function handleSearch(e) {
    e.preventDefault();
    if (term.trim()) onSearch(term.trim());
  }

  return (
    <section className="relative px-6 md:px-12 pt-10 pb-8 overflow-hidden">
      {/* Decorative leaf shape — top right */}
      <div
        className="pointer-events-none absolute -top-16 -right-20 w-80 h-96 bg-dark-green opacity-90 rounded-full"
        style={{ clipPath: "ellipse(55% 80% at 80% 30%)" }}
        aria-hidden="true"
      />

      <h1 className="text-4xl md:text-5xl font-bold text-dark-green mb-3 relative z-10">
        Bem-vinda, {userName}!
      </h1>
      <p className="text-gray-700 text-base md:text-lg mb-6 relative z-10">
        Acompanhe oportunidades, notícias e eventos da sua rede{" "}
        <span className="font-bold text-green">Alumni IFMA</span>.
      </p>

      <form
        onSubmit={handleSearch}
        className="flex items-center w-full max-w-lg bg-white border border-gray-300 rounded-full overflow-hidden shadow-sm relative z-10"
      >
        <Search size={18} className="ml-4 text-gray-400 shrink-0" />
        <input
          type="text"
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          placeholder="Mentores, egressos e professores"
          className="flex-1 px-3 py-3 text-sm outline-none bg-transparent text-gray-700 placeholder:text-gray-400"
        />
        <button
          type="submit"
          className="bg-dark-green text-white text-sm font-semibold px-6 py-3 hover:bg-green transition-colors"
        >
          Buscar
        </button>
      </form>
    </section>
  );
}
