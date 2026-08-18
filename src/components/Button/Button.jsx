const variants = {
  primary:
    "bg-carmine text-2xl text-white font-semibold px-6 py-3 w-full rounded-xl mt-6",
  icon: "w-[53px] h-[53px] flex items-center justify-center rounded-xl",
  connect:
    "bg-dark-green text-white text-sm font-medium px-4 py-1.5 rounded-full transition-colors disabled:opacity-70 disabled:cursor-default whitespace-nowrap",
};

export function Button({ children, variant, className = "", ...props }) {
  return (
    <button
      className={`cursor-pointer ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
