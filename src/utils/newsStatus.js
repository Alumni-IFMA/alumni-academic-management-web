import { format } from "date-fns";

export function parseBackendDate(value) {
  if (value == null) return null;

  if (Array.isArray(value)) {
    const [year, month, day, hour = 0, minute = 0, second = 0] = value;
    return new Date(year, month - 1, day, hour, minute, second);
  }

  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function deriveNewsStatus({ draft, publishedAt }) {
  if (draft) return "draft";

  const parsedDate = parseBackendDate(publishedAt);
  if (parsedDate && parsedDate.getTime() > Date.now()) return "scheduled";

  return "published";
}

export function formatPublishedAt(publishedAt) {
  const parsedDate = parseBackendDate(publishedAt);
  return parsedDate ? format(parsedDate, "dd/MM/yyyy") : "Não publicado";
}
