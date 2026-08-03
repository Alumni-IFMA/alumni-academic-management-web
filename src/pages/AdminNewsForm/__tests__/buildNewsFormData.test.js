import { describe, it, expect } from "vitest";
import { buildNewsFormData } from "../buildNewsFormData";

describe("buildNewsFormData", () => {
  it("builds FormData with title, summary, content and draft flag", () => {
    const fd = buildNewsFormData({ title: "T", content: "C", draft: true, publishedAt: null, coverFile: null });

    expect(fd.get("title")).toBe("T");
    expect(fd.get("summary")).toBe("");
    expect(fd.get("content")).toBe("C");
    expect(fd.get("draft")).toBe("true");
  });

  it("omits publishedAt when null", () => {
    const fd = buildNewsFormData({ title: "T", content: "C", draft: false, publishedAt: null, coverFile: null });
    expect(fd.has("publishedAt")).toBe(false);
  });

  it("includes publishedAt as an ISO string when a Date is given", () => {
    const date = new Date(2026, 7, 10);
    const fd = buildNewsFormData({ title: "T", content: "C", draft: false, publishedAt: date, coverFile: null });
    expect(fd.get("publishedAt")).toBe(date.toISOString());
  });

  it("omits coverImage when no file is given", () => {
    const fd = buildNewsFormData({ title: "T", content: "C", draft: false, publishedAt: null, coverFile: null });
    expect(fd.has("coverImage")).toBe(false);
  });

  it("includes coverImage when a file is given", () => {
    const file = new File(["binary"], "cover.png", { type: "image/png" });
    const fd = buildNewsFormData({ title: "T", content: "C", draft: false, publishedAt: null, coverFile: file });
    expect(fd.get("coverImage")).toBe(file);
  });
});
