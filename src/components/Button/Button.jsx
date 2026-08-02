const variants = {
  primary: "bg-carmine text-2xl text-white font-semibold px-6 py-3 w-full rounded-xl mt-6",
  icon: "w-[53px] h-[53px] flex items-center justify-center rounded-xl",
};

export function Button({ children, variant, className = "", ...props }) {
  return (
    <button
      className={`cursor-pointer ${variants[variant]} ${className}`} {...props}
    >
      {children}
    </button>
  );
}
