import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  document.cookie = "gtshop_admin_token=; Path=/; Max-Age=0; SameSite=Lax";
  vi.resetModules();
  vi.unstubAllGlobals();
  vi.unstubAllEnvs();
});

describe("shopeeService.submitCallback", () => {
  it("envia Authorization bearer quando ha sessao autenticada", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ success: true, shopId: 123 }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    vi.stubGlobal("fetch", fetchMock);

    const { persistSessionToken } = await import("@/lib/auth/session");
    const { shopeeService } = await import("@/services/shopee-service");

    persistSessionToken("jwt-token");

    await shopeeService.submitCallback({ code: "abc123", shopId: 123 });

    expect(fetchMock).toHaveBeenCalledTimes(1);

    const [, requestInit] = fetchMock.mock.calls[0] as [string, RequestInit];
    const headers = new Headers(requestInit.headers);

    expect(requestInit.method).toBe("POST");
    expect(requestInit.body).toBe(JSON.stringify({ code: "abc123", shopId: 123 }));
    expect(headers.get("Authorization")).toBe("Bearer jwt-token");
    expect(headers.get("Content-Type")).toBe("application/json");
  });

  it("falha de forma controlada quando nao ha token", async () => {
    const fetchMock = vi.fn();
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    vi.stubGlobal("fetch", fetchMock);

    const { shopeeService } = await import("@/services/shopee-service");

    await expect(shopeeService.submitCallback({ code: "abc123", shopId: 123 })).rejects.toMatchObject({
      status: 401,
      message: "Sua sessao expirou. Faca login novamente para continuar.",
    });

    expect(fetchMock).not.toHaveBeenCalled();
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "auth:unauthorized" }));
  });

  it("propaga 401 do backend como sessao invalida", async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ message: "Authentication token not provided." }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    );
    const dispatchEventSpy = vi.spyOn(window, "dispatchEvent");

    vi.stubGlobal("fetch", fetchMock);

    const { persistSessionToken } = await import("@/lib/auth/session");
    const { shopeeService } = await import("@/services/shopee-service");

    persistSessionToken("expired-token");

    await expect(shopeeService.submitCallback({ code: "abc123", shopId: 123 })).rejects.toMatchObject({
      status: 401,
      message: "Authentication token not provided.",
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(dispatchEventSpy).toHaveBeenCalledWith(expect.objectContaining({ type: "auth:unauthorized" }));
  });
});