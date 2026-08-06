export function buildNewsFormData({ title, summary, content, draft, publishedAt, coverFile }) {
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
