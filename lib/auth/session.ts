"use client";

import { SESSION_COOKIE_NAME, SESSION_DURATION_SECONDS } from "@/lib/constants";

function cookieAttributes() {
  return `Path=/; Max-Age=${SESSION_DURATION_SECONDS}; SameSite=Lax`;
}

export function getSessionToken() {
  if (typeof document === "undefined") {
    return null;
  }

  const cookie = document.cookie
    .split("; ")
    .find((item) => item.startsWith(`${SESSION_COOKIE_NAME}=`));

  if (!cookie) {
    return null;
  }

  return decodeURIComponent(cookie.split("=").slice(1).join("="));
}

export function persistSessionToken(token: string) {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}; ${cookieAttributes()}`;
}

export function clearSessionToken() {
  if (typeof document === "undefined") {
    return;
  }

  document.cookie = `${SESSION_COOKIE_NAME}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function hasSessionToken() {
  return Boolean(getSessionToken());
}