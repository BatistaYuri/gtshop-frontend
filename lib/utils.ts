export function cn(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function formatDateTime(value?: string | null) {
  if (!value) {
    return "Nao informado";
  }

  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(parsed);
}

export function formatNumber(value?: number | null) {
  if (value === null || value === undefined) {
    return "-";
  }

  return new Intl.NumberFormat("pt-BR").format(value);
}

export function humanizeStatus(value?: string | null) {
  if (!value) {
    return "Nao informado";
  }

  return value
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function parseNumberList(rawValue: string) {
  return rawValue
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => Number(item))
    .filter((item) => Number.isFinite(item));
}

export function compactMessage(message?: string | null, fallback = "Sem detalhes adicionais") {
  return message?.trim() || fallback;
}

export function safeRedirectPath(value?: string | null, fallback = "/dashboard") {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return fallback;
  }

  return value;
}

export function getJobUpdatedCount(payload?: {
  updatedProductsCount?: number | null;
  productsUpdated?: number | null;
  totalUpdated?: number | null;
}) {
  return payload?.updatedProductsCount ?? payload?.productsUpdated ?? payload?.totalUpdated ?? null;
}

export function getShopeeConnected(status?: {
  connected?: boolean;
  isConnected?: boolean;
  authorized?: boolean;
  status?: string;
}) {
  if (typeof status?.connected === "boolean") {
    return status.connected;
  }

  if (typeof status?.isConnected === "boolean") {
    return status.isConnected;
  }

  if (typeof status?.authorized === "boolean") {
    return status.authorized;
  }

  if (status?.status) {
    return ["connected", "authorized", "active", "ok"].includes(status.status.toLowerCase());
  }

  return false;
}