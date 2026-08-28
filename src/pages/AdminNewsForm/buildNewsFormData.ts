export interface BuildNewsFormDataInput {
  title: string;
  summary?: string;
  content: string;
  draft: boolean;
  publishedAt?: Date | null;
  coverFile?: File | null;
}

export function buildNewsFormData({
  title,
  summary,
  content,
  draft,
  publishedAt,
  coverFile,
}: BuildNewsFormDataInput): FormData {
  const formData = new FormData();
  formData.append("title", title);
  formData.append("summary", summary ?? "");
  formData.append("content", content);
  formData.append("draft", String(draft));

  if (publishedAt) {
    formData.append("publishedAt", publishedAt.toISOString());
  }

  if (coverFile) {
    formData.append("coverImage", coverFile);
  }

  return formData;
}
