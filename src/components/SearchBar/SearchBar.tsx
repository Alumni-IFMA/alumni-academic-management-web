import { Search } from "lucide-react";
import type { ChangeEventHandler, KeyboardEvent } from "react";

export function SearchBar({
  placeholder = "Pesquise...",
  value,
  onChange,
  onSearch,
  buttonText = "Buscar",
  className = "",
}: {
  placeholder?: string;
  value: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onSearch?: () => void;
  buttonText?: string;
  className?: string;
}) {
  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      onSearch?.();
    }
  }

  return (
    <div
      className={`flex items-center bg-white rounded-3xl overflow-hidden w-full ${className} shadow-[0_-4px_10px_rgba(0,0,0,0.08),0_4px_10px_rgba(0,0,0,0.08)]`}
    >
      <div className="relative flex-1">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
        />
        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="w-full py-3 pl-11 pr-2 text-sm outline-none [&::-webkit-search-cancel-button]:mr-2"
        />
      </div>

      <button
        type="button"
        onClick={onSearch}
        className="bg-dark-green text-white text-sm font-semibold px-6 py-3 hover:bg-green transition-colors"
      >
        {buttonText}
      </button>
    </div>
  );
}
