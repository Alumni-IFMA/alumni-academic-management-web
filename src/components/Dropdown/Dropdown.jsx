import arrowDown from "../../assets/arrow-down.png";

export function Dropdown({ items, ...rest }) {
  return (
    <div className="relative w-full">
      <select
        className="w-full px-6 py-4 border border-dark-green bg-white rounded-lg appearance-none text-lg"
        {...rest}
        defaultValue=""
      >
        <option className="font-dark-green font-semibold" value="" disabled>
          Selecione uma opção
        </option>

        {items.map((item) => (
          <option key={item.id} value={item.id}>
            {item.name}
          </option>
        ))}
      </select>

      <img
        src={arrowDown}
        alt="Seta dropdown"
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-3 w-5"
      />
    </div>
  );
}
