import lupa from "../../assets/lupa.png";

export function SearchBar({
  placeholder = "Pesquise...",
  value,
  onChange,
  onSearch,
  buttonText = "Buscar",
  className = "",
}) {
  function handleKeyDown(e) {
    if (e.key === "Enter") {
      onSearch?.();
    }
  }

  return (
    <div
      className={`flex items-center bg-white rounded-3xl overflow-hidden w-full ${className} shadow-[0_-4px_10px_rgba(0,0,0,0.08),0_4px_10px_rgba(0,0,0,0.08)]`}
    >
      <div className="relative flex-1">
        <img
          src={lupa}
          alt="Pesquisar"
          className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5"
        />

        <input
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onKeyDown={handleKeyDown}
          className="w-full py-4 pl-11 pr-4 text-lg outline-none"
        />
      </div>

      <button
        onClick={onSearch}
        className="bg-dark-green text-white font-medium px-8 py-3 rounded-2xl mr-2 hover:opacity-90 transition"
      >
        {buttonText}
      </button>
    </div>
  );
}