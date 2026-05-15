import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PUBLIC_ROUTES, ROUTES, SESSION_COOKIE_NAME } from "@/lib/constants";

function isPublicPath(pathname: string) {
  return PUBLIC_ROUTES.has(pathname);
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico" ||
    /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|map)$/.test(pathname)
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  if (pathname === "/") {
    return NextResponse.redirect(new URL(token ? ROUTES.dashboard : ROUTES.login, request.url));
  }

  if (pathname === ROUTES.login && token) {
    return NextResponse.redirect(new URL(ROUTES.dashboard, request.url));
  }

  if (!isPublicPath(pathname) && !token) {
    const loginUrl = new URL(ROUTES.login, request.url);
    const redirectTarget = `${pathname}${search}`;
    loginUrl.searchParams.set("redirect", redirectTarget);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};