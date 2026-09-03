import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SearchFilterBar } from "./components/SearchFilterBar";
import { HighlightsCarousel } from "./components/HighlightsCarousel";
import { SuggestionsGrid } from "./components/SuggestionsGrid";
import { SearchResults } from "./components/SearchResults";
import { Typography } from "../../components/Typography/Typography";
import { useSuggestions } from "./hooks/useSuggestions";
import { useConnection } from "../../hooks/useConnection";

const HIGHLIGHTS_COUNT = 8;

export default function RedeAlumni() {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeSearch = searchParams.get("q");
  const { users, loading, error } = useSuggestions();
  const { connect, statusFor } = useConnection();
  const [resetKey, setResetKey] = useState(0);

  function handleSearch(query: string) {
    if (query) setSearchParams({ q: query });
    else setSearchParams({});
  }

  function handleClear() {
    setSearchParams({});
    setResetKey((key) => key + 1);
  }

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-8">
      <div className="space-y-10">
        <header className="space-y-1">
          <Typography variant="h1" className="!text-4xl md:!text-5xl !font-bold !leading-none">
            Conecte-se com seus colegas
          </Typography>
          <Typography variant="p">
            Descubra pessoas, histórias e oportunidades. Encontre colegas por área de atuação e curso.
          </Typography>
        </header>
        <SearchFilterBar key={resetKey} onSearch={handleSearch} />
        {activeSearch ? (
          <SearchResults
            query={activeSearch}
            users={users}
            statusFor={statusFor}
            onConnect={connect}
            onClear={handleClear}
          />
        ) : (
          <>
            <HighlightsCarousel
              users={users.slice(0, HIGHLIGHTS_COUNT)}
              loading={loading}
              error={error}
              statusFor={statusFor}
              onConnect={connect}
            />
            <SuggestionsGrid
              users={users.slice(HIGHLIGHTS_COUNT)}
              loading={loading}
              error={error}
              statusFor={statusFor}
              onConnect={connect}
            />
          </>
        )}
      </div>
    </main>
  );
}
