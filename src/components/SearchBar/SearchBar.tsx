import { Search, X } from "lucide-react";
import type { ChangeEvent, ChangeEventHandler, KeyboardEvent } from "react";

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

  function handleClear() {
    onChange({ target: { value: "" } } as ChangeEvent<HTMLInputElement>);
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
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="w-full py-3 pl-11 pr-9 text-sm outline-none"
        />
        {value && (
          <button
            type="button"
            onClick={handleClear}
            aria-label="Limpar busca"
            className="absolute right-3 top-1/2 -translate-y-1/2 text-green hover:text-green-600"
          >
            <X size={16} />
          </button>
        )}
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
