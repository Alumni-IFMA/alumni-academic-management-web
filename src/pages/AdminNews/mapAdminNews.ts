import { deriveNewsStatus, formatPublishedAt, type NewsStatus } from "../../utils/newsStatus";
import type { NewsRawDto } from "../../services/newsService";
import type { NewsListItem } from "../News/mapNews";

export type AdminNewsItem = NewsListItem & { status: NewsStatus };

const DESCRIPTION_FALLBACK_LENGTH = 150;

function fallbackDescription(content?: string | null): string {
  if (!content) return "";
  return content.length > DESCRIPTION_FALLBACK_LENGTH
    ? `${content.slice(0, DESCRIPTION_FALLBACK_LENGTH)}...`
    : content;
}

export function mapAdminNews(dto: NewsRawDto): AdminNewsItem {
  const status = deriveNewsStatus({ draft: dto.draft, publishedAt: dto.publishedAt });

  return {
    id: dto.id,
    title: dto.title,
    description: dto.summary?.trim() ? dto.summary : fallbackDescription(dto.content),
    coverImage: dto.coverImageUrl,
    status,
    publishedAt:
      status === "draft"
        ? formatPublishedAt(dto.publishedAt)
        : formatPublishedAt(dto.publishedAt, dto.createdAt),
  };
}
