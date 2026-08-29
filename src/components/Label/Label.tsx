import type { ReactNode } from "react";

export function Label({ children, htmlFor }: { children: ReactNode; htmlFor?: string }) {
  return <label className="font-dark-green font-semibold text-base" htmlFor={htmlFor}>{children}</label>;
}
