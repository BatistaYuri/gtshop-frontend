import { afterEach, describe, expect, it, vi } from "vitest";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("resolveApiBaseUrl", () => {
  it("prefers NEXT_PUBLIC_API_BASE_URL when configured", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://api.example.com/");

    const { resolveApiBaseUrl } = await import("@/lib/api-client");

    expect(resolveApiBaseUrl()).toBe("http://api.example.com");
  });

  it("rewrites loopback env URLs to the current browser hostname", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "http://localhost:3000/");
    vi.stubGlobal("window", {
      location: {
        hostname: "192.168.1.26",
        protocol: "http:",
      },
    });

    const { resolveApiBaseUrl } = await import("@/lib/api-client");

    expect(resolveApiBaseUrl()).toBe("http://192.168.1.26:3000");
  });

  it("uses the current browser hostname when env is missing", async () => {
    vi.stubEnv("NEXT_PUBLIC_API_BASE_URL", "");
    vi.stubGlobal("window", {
      location: {
        hostname: "192.168.1.26",
        protocol: "http:",
      },
    });

    const { resolveApiBaseUrl } = await import("@/lib/api-client");

    expect(resolveApiBaseUrl()).toBe("http://192.168.1.26:3000");
  });
});