export const SESSION_COOKIE_NAME = "gtshop_admin_token";
export const SESSION_DURATION_SECONDS = 60 * 60 * 8;

export const ROUTES = {
  login: "/login",
  dashboard: "/dashboard",
  stock: "/stock",
  flashSales: "/flash-sales",
  shopee: "/shopee",
  shopeeCallback: "/shopee/callback",
} as const;

export const PUBLIC_ROUTES = new Set<string>([ROUTES.login, ROUTES.shopeeCallback]);

