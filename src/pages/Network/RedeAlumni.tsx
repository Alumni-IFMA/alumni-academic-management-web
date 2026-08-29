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
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div className="space-y-10">
        <header className="space-y-1">
          <Typography variant="h1" className="!text-4xl md:!text-5xl !font-bold !leading-none">Conecte-se com seus colegas</Typography>
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
