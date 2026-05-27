"use client";

import { clearSessionToken, getSessionToken } from "@/lib/auth/session";
import { ApiError, getApiErrorPayload } from "@/lib/errors";

const DEFAULT_API_PORT = "3000";

const inflightRequests = new Map<string, Promise<unknown>>();

function replaceLoopbackHostname(baseUrl: string) {
  if (typeof window === "undefined") {
    return baseUrl;
  }

  try {
    const parsedUrl = new URL(baseUrl);

    if (!["localhost", "127.0.0.1", "::1"].includes(parsedUrl.hostname)) {
      return baseUrl;
    }

    parsedUrl.hostname = window.location.hostname;
    return parsedUrl.toString().replace(/\/$/, "");
  } catch {
    return baseUrl;
  }
}

export function resolveApiBaseUrl() {
  const configuredBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "");

  if (configuredBaseUrl) {
    return replaceLoopbackHostname(configuredBaseUrl);
  }

  if (typeof window !== "undefined") {
    const { hostname, protocol } = window.location;
    return `${protocol}//${hostname}:${DEFAULT_API_PORT}`;
  }

  return `http://localhost:${DEFAULT_API_PORT}`;
}

const API_BASE_URL = resolveApiBaseUrl();

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  headers?: HeadersInit;
  requiresAuth?: boolean;
  token?: string | null;
  cache?: RequestCache;
};

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type") || "";

  if (response.status === 204) {
    return undefined;
  }

  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return text ? { message: text } : undefined;
}

function emitUnauthorized() {
  if (typeof window === "undefined") {
    return;
  }

  clearSessionToken();
  window.dispatchEvent(new CustomEvent("auth:unauthorized"));
}

async function executeRequest<T>(path: string, options: RequestOptions): Promise<T> {
  const headers = new Headers(options.headers);
  const token = options.token ?? getSessionToken();
  const requiresAuth = options.requiresAuth !== false;

  if (requiresAuth && !token) {
    emitUnauthorized();
    throw new ApiError("Sua sessao expirou. Faca login novamente para continuar.", 401);
  }

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (requiresAuth && token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: options.cache ?? "no-store",
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    const errorPayload = getApiErrorPayload(payload);
    const message =
      errorPayload?.message || errorPayload?.error || response.statusText || "Erro inesperado na API.";

    if (response.status === 401 && requiresAuth) {
      emitUnauthorized();
    }

    throw new ApiError(message, response.status, errorPayload ?? payload);
  }

  return payload as T;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const method = options.method ?? "GET";
  const dedupKey = `${method}:${path}`;

  // Deduplicate in-flight GET requests to prevent duplicate network calls
  // caused by React Strict Mode double-invoking effects in development.
  if (method === "GET") {
    const existing = inflightRequests.get(dedupKey) as Promise<T> | undefined;
    if (existing) {
      return existing;
    }
  }

  const promise = executeRequest<T>(path, options);

  if (method === "GET") {
    inflightRequests.set(dedupKey, promise);
    promise.finally(() => inflightRequests.delete(dedupKey));
  }

  return promise;
}