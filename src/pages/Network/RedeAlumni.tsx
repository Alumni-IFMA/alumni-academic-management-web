import { useSearchParams } from "react-router-dom";
import { SearchFilterBar, type SearchFilterParams } from "./components/SearchFilterBar";
import { HighlightsCarousel } from "./components/HighlightsCarousel";
import { SuggestionsGrid } from "./components/SuggestionsGrid";
import { SearchResults } from "./components/SearchResults";
import { Typography } from "../../components/Typography/Typography";

export default function RedeAlumni() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSearch = searchParams.get("q");

  function handleSearch({ query }: SearchFilterParams) {
    if (query) setSearchParams({ q: query });
  }

  function handleClear() {
    setSearchParams({});
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-7xl space-y-10">
        <header className="space-y-1">
          <Typography variant="h1" className="">Conecte-se com seus colegas</Typography>
          <Typography variant="p">Descubra pessoas, histórias e oportunidades. Encontre colegas por área de atuação e curso.</Typography>
        </header>
        <SearchFilterBar key={activeSearch ?? "empty"} onSearch={handleSearch} />
        {activeSearch ? (
          <SearchResults query={activeSearch} onClear={handleClear} />
        ) : (
          <>
            <HighlightsCarousel />
            <SuggestionsGrid />
          </>
        )}
      </div>
    </main>
  );
}
