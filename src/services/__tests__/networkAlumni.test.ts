import { describe, it, expect, vi, beforeEach, type Mocked } from "vitest";
import api from "../api";
import networkAlumni from "../networkAlumni";
import type { UserSimpleDto } from "../userService";

vi.mock("../api");
const mockedApi = api as Mocked<typeof api>;

const dto: UserSimpleDto = {
  id: 1,
  name: "João Silva",
  email: "joao@example.com",
  status: "ACTIVE",
  role: "ALUMNI",
  academicProfiles: [],
};

describe("networkAlumni.getSuggestions", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /connections/suggestions with no params and maps the result", async () => {
    mockedApi.get.mockResolvedValue({ data: [dto] });

    const result = await networkAlumni.getSuggestions();

    expect(mockedApi.get).toHaveBeenCalledWith("/connections/suggestions");
    expect(result).toEqual([{ id: 1, name: "João Silva", subtitle: undefined, meta: undefined, avatarUrl: null }]);
  });
});

describe("networkAlumni.sendRequest", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls POST /connections with addresseeId", async () => {
    mockedApi.post.mockResolvedValue({ data: {} });

    await networkAlumni.sendRequest(9);

    expect(mockedApi.post).toHaveBeenCalledWith("/connections", { addresseeId: 9 });
  });
});

describe("networkAlumni.getSentRequests", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /connections/sent and returns the raw list", async () => {
    const sent = [{ id: 1, requester: dto, addressee: dto, status: "PENDING" as const }];
    mockedApi.get.mockResolvedValue({ data: sent });

    const result = await networkAlumni.getSentRequests();

    expect(mockedApi.get).toHaveBeenCalledWith("/connections/sent");
    expect(result).toEqual(sent);
  });
});
