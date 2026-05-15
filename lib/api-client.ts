"use client";

import { clearSessionToken, getSessionToken } from "@/lib/auth/session";
import { ApiError, getApiErrorPayload } from "@/lib/errors";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:3000";

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

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const headers = new Headers(options.headers);
  const token = options.token ?? getSessionToken();

  if (options.body !== undefined) {
    headers.set("Content-Type", "application/json");
  }

  if (options.requiresAuth !== false && token) {
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

    if (response.status === 401 && options.requiresAuth !== false) {
      emitUnauthorized();
    }

    throw new ApiError(message, response.status, errorPayload ?? payload);
  }

  return payload as T;
}