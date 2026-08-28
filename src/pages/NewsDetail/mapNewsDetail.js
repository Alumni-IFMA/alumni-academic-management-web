import { formatPublishedAt } from "../../utils/newsStatus";

export function mapNewsDetail(dto) {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content ?? "",
    coverImage: dto.coverImageUrl,
    publishedAt: formatPublishedAt(dto.publishedAt, dto.createdAt),
  };
}
