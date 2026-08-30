import { describe, it, expect } from "vitest";
import { getAvatarForUser } from "../avatarFallback";

describe("getAvatarForUser", () => {
  it("returns the same avatar for the same id", () => {
    expect(getAvatarForUser(3)).toBe(getAvatarForUser(3));
  });

  it("cycles through the 5 available avatars", () => {
    const avatars = new Set([0, 1, 2, 3, 4].map((id) => getAvatarForUser(id)));
    expect(avatars.size).toBe(5);
  });
});
