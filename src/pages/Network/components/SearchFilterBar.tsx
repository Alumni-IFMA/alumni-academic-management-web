import { useState, type ChangeEvent } from "react";
import { SearchBar } from "../../../components/SearchBar/SearchBar";

export function SearchFilterBar({ onSearch }: { onSearch: (query: string) => void }) {
  const [query, setQuery] = useState("");

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
