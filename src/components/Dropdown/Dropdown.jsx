import arrowDown from "../../assets/arrow-down.png";

export function Dropdown({
  items,
  defaultValue,
  value,
  className = "",
  bordered = false,
  size = "lg",
  ...rest
}) {
  const sizeStyles = {
    lg: "px-6 py-2 text-base",
    sm: "px-4 py-2 text-sm",
  };

  const valueProps =
    value !== undefined ? { value } : { defaultValue: defaultValue ?? "" };

  return (
    <div className={`relative ${className}`}>
      <select
        className={`w-full bg-white rounded-lg appearance-none ${sizeStyles[size]} ${bordered ? "border border-dark-green" : "border-0"}`}
        {...rest}
        {...valueProps}
      >
        <option className="font-dark-green font-semibold" value="">
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