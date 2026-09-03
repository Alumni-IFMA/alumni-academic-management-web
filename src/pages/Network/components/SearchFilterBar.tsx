import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { SearchBar } from "../../../components/SearchBar/SearchBar";
import { useDebouncedValue } from "../../../hooks/useDebouncedValue";

export function SearchFilterBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebouncedValue(query, 400);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    onSearch(debouncedQuery.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedQuery]);

  function handleSearch() {
    onSearch(query.trim());
  }

  return (
    <SearchBar
      placeholder="Mentores, egressos e professores"
      value={query}
      onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
      onSearch={handleSearch}
    />
  );
}
