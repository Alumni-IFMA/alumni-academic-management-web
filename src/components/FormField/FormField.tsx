import type { ReactNode } from "react";

export function FormField({ children }: { children: ReactNode }) {
  return <fieldset className="flex flex-col gap-1">{children}</fieldset>;
}
