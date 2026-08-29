import { formatPublishedAt } from "../../utils/newsStatus";
import type { NewsRawDto } from "../../services/newsService";

export interface NewsListItem {
  id: number;
  title: string;
  description: string;
  coverImage?: string | null;
  publishedAt: string;
}

const DESCRIPTION_FALLBACK_LENGTH = 150;

function fallbackDescription(content?: string | null): string {
  if (!content) return "";
  return content.length > DESCRIPTION_FALLBACK_LENGTH
    ? `${content.slice(0, DESCRIPTION_FALLBACK_LENGTH)}...`
    : content;
}

export function mapNews(dto: NewsRawDto): NewsListItem {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.summary?.trim() ? dto.summary : fallbackDescription(dto.content),
    coverImage: dto.coverImageUrl,
    publishedAt: formatPublishedAt(dto.publishedAt, dto.createdAt),
  };
}
