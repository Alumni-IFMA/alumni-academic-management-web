import type { ReactNode } from "react";

const TAGS: Record<string, keyof JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  p: "p",
};

const VARIANT_CLASS: Record<string, string> = {
  h1: "font-extrabold text-5xl leading-[150%] text-dark-green",
  h2: "font-bold text-4xl leading-[140%] text-dark-green",
  h3: "font-semibold text-2xl leading-[130%] text-dark-green",
  p: "text-lg text-dark-green",
};

export function Typography({
  children,
  variant = "p",
  className = "",
}: {
  children: ReactNode;
  variant?: "h1" | "h2" | "h3" | "p";
  className?: string;
}) {
  const Component = TAGS[variant] || "p";

  return (
    <Component className={`${VARIANT_CLASS[variant]} ${className}`}>
      {children}
    </Component>
  );
}
