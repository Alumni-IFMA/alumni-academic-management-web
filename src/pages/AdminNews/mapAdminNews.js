import { deriveNewsStatus, formatPublishedAt } from "../../utils/newsStatus.js";

export function mapAdminNews(dto) {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.summary,
    coverImage: dto.coverImageUrl,
    status: deriveNewsStatus({ draft: dto.draft, publishedAt: dto.publishedAt }),
    publishedAt: formatPublishedAt(dto.publishedAt),
  };
}
