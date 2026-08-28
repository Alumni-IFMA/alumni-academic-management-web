import { deriveNewsStatus, formatPublishedAt } from "../../utils/newsStatus";

const DESCRIPTION_FALLBACK_LENGTH = 150;

function fallbackDescription(content) {
  if (!content) return "";
  return content.length > DESCRIPTION_FALLBACK_LENGTH
    ? `${content.slice(0, DESCRIPTION_FALLBACK_LENGTH)}...`
    : content;
}

export function mapAdminNews(dto) {
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
