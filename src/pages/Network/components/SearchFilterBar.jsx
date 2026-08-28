import { useState } from "react";
import { SearchBar } from "../../../components/SearchBar/SearchBar";

const PROFILE_TYPES = [
  { value: "todos", label: "Todos" },
  { value: "egresso", label: "Egressos" },
  { value: "mentor", label: "Mentores" },
  { value: "professor", label: "Professores" },
];

export function SearchFilterBar({ onSearch }) {
  const [query, setQuery] = useState("");
  const [profileType, setProfileType] = useState("todos");

  function handleSearch() {
    onSearch({ query: query.trim(), profileType });
  }

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <SearchBar
        placeholder="Mentores, egressos e professores"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onSearch={handleSearch}
        className="flex-1"
      />

      <div className="relative">
        <select
          value={profileType}
          onChange={(e) => setProfileType(e.target.value)}
          className="w-full appearance-none rounded-3xl bg-white px-5 py-3 pr-9 text-sm text-gray-700 outline-none shadow-[0_-4px_10px_rgba(0,0,0,0.08),0_4px_10px_rgba(0,0,0,0.08)] sm:w-40"
        >
          {PROFILE_TYPES.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}