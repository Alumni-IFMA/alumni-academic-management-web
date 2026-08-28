import { describe, it, expect, beforeEach, afterEach } from "vitest";
import MockAdapter from "axios-mock-adapter";
import api from "../api";

describe("interceptors do api", () => {
  let mock: MockAdapter;

  beforeEach(() => {
    mock = new MockAdapter(api);
    localStorage.clear();
  });

  afterEach(() => {
    mock.restore();
  });

  it("anexa o header Authorization quando existe token no localStorage", async () => {
    localStorage.setItem("token", "jwt-123");
    mock.onGet("/test").reply(200, {});

    const res = await api.get("/test");

    expect(res.config.headers.Authorization).toBe("Bearer jwt-123");
  });

  it("não anexa o header Authorization quando não existe token", async () => {
    mock.onGet("/test").reply(200, {});

    const res = await api.get("/test");

    expect(res.config.headers.Authorization).toBeUndefined();
  });

  it("limpa o token e redireciona para /auth/login em caso de 401", async () => {
    localStorage.setItem("token", "jwt-expirado");
    mock.onGet("/protegido").reply(401);

    // @ts-expect-error - substitui window.location por um stub para capturar o redirect
    delete window.location;
    // @ts-expect-error - stub mínimo, só o campo href é lido pelo código sob teste
    window.location = { href: "" };

    try {
      await api.get("/protegido");
    } catch {
      // rejeição esperada
    }

    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.href).toBe("/auth/login");
  });
});