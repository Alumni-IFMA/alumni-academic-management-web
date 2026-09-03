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

  it("calls GET /connections/suggestions with no params and maps the paginated content", async () => {
    mockedApi.get.mockResolvedValue({ data: { content: [dto] } });

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

describe("networkAlumni.getPendingRequests", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /connections/pending and returns the raw list", async () => {
    const pending = [{ id: 2, requester: dto, addressee: dto, status: "PENDING" as const }];
    mockedApi.get.mockResolvedValue({ data: pending });

    const result = await networkAlumni.getPendingRequests();

    expect(mockedApi.get).toHaveBeenCalledWith("/connections/pending");
    expect(result).toEqual(pending);
  });
});

describe("networkAlumni.getAcceptedConnections", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls GET /connections and returns the raw list", async () => {
    const accepted = [{ id: 3, requester: dto, addressee: dto, status: "ACCEPTED" as const }];
    mockedApi.get.mockResolvedValue({ data: accepted });

    const result = await networkAlumni.getAcceptedConnections();

    expect(mockedApi.get).toHaveBeenCalledWith("/connections");
    expect(result).toEqual(accepted);
  });
});

describe("networkAlumni.acceptConnection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls PATCH /connections/{id}/accept", async () => {
    mockedApi.patch.mockResolvedValue({ data: {} });

    await networkAlumni.acceptConnection(9);

    expect(mockedApi.patch).toHaveBeenCalledWith("/connections/9/accept");
  });
});

describe("networkAlumni.declineConnection", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls DELETE /connections/{id}", async () => {
    mockedApi.delete.mockResolvedValue({ data: {} });

    await networkAlumni.declineConnection(9);

    expect(mockedApi.delete).toHaveBeenCalledWith("/connections/9");
  });
});
