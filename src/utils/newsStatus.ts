import { format } from "date-fns";

export type NewsStatus = "draft" | "scheduled" | "published";
export type BackendDate = string | number[] | null | undefined;

export function parseBackendDate(value: BackendDate): Date | null {
  if (value == null) return null;

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    return new Date(year, month - 1, day, hour, minute, second);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function deriveNewsStatus({
  draft,
  publishedAt,
}: {
  draft: boolean;
  publishedAt?: BackendDate;
}): NewsStatus {
  if (draft) return "draft";

  const parsedDate = parseBackendDate(publishedAt);
  if (parsedDate && parsedDate.getTime() > Date.now()) return "scheduled";

  return "published";
}

export function formatPublishedAt(publishedAt?: BackendDate, fallbackDate?: BackendDate): string {
  const parsedDate = parseBackendDate(publishedAt) ?? parseBackendDate(fallbackDate);
  return parsedDate ? format(parsedDate, "dd/MM/yyyy") : "Não publicado";
}
