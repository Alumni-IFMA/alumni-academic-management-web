import { formatPublishedAt } from "../../utils/newsStatus";
import type { NewsRawDto } from "../../services/newsService";

export interface NewsArticle {
  id: number;
  title: string;
  content: string;
  coverImage?: string | null;
  publishedAt: string;
}

export function mapNewsDetail(dto: NewsRawDto): NewsArticle {
  return {
    id: dto.id,
    title: dto.title,
    content: dto.content ?? "",
    coverImage: dto.coverImageUrl,
    publishedAt: formatPublishedAt(dto.publishedAt, dto.createdAt),
  };
}
