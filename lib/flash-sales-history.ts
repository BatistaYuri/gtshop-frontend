import { compactMessage } from "@/lib/utils";
import type { FlashSaleHistoryItem, FlashSaleHistoryStatus } from "@/types/api";

export const DEFAULT_FLASH_SALE_HISTORY_PAGE = 1;
export const DEFAULT_FLASH_SALE_HISTORY_LIMIT = 50;
export const MAX_FLASH_SALE_HISTORY_LIMIT = 200;

export interface FlashSaleHistoryFiltersState {
  executionId: number | undefined;
  search: string;
  status: "" | FlashSaleHistoryStatus;
  dateFrom: string;
  dateTo: string;
}

export interface FlashSaleHistoryQueryState {
  page: number;
  limit: number;
  filters: FlashSaleHistoryFiltersState;
}

export interface FlashSaleHistoryTableRow {
  id: number;
  createdAt: string;
  executionLabel: string;
  sourceFlashSaleLabel: string;
  targetFlashSaleLabel: string;
  flashSaleName: string;
  targetDate: string;
  status: FlashSaleHistoryStatus;
  errorMessage: string;
}

export const DEFAULT_FLASH_SALE_HISTORY_FILTERS: FlashSaleHistoryFiltersState = {
  executionId: undefined,
  search: "",
  status: "",
  dateFrom: "",
  dateTo: "",
};

function parsePositiveInteger(value: string | null, fallback: number) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return fallback;
  }

  return Math.trunc(parsed);
}

function toStatus(value: string | null): "" | FlashSaleHistoryStatus {
  if (value === "SUCCESS" || value === "ERROR" || value === "SKIPPED") {
    return value;
  }

  return "";
}

function toExecutionId(value: string | null): number | undefined {
  if (!value) {
    return undefined;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? Math.trunc(parsed) : undefined;
}

export function parseFlashSaleHistoryQuery(searchParams: URLSearchParams): FlashSaleHistoryQueryState {
  const page = parsePositiveInteger(searchParams.get("page"), DEFAULT_FLASH_SALE_HISTORY_PAGE);
  const parsedLimit = parsePositiveInteger(searchParams.get("limit"), DEFAULT_FLASH_SALE_HISTORY_LIMIT);
  const limit = Math.min(parsedLimit, MAX_FLASH_SALE_HISTORY_LIMIT);

  return {
    page,
    limit,
    filters: {
      executionId: toExecutionId(searchParams.get("executionId")),
      search: searchParams.get("search")?.trim() || "",
      status: toStatus(searchParams.get("status")),
      dateFrom: searchParams.get("dateFrom")?.trim() || "",
      dateTo: searchParams.get("dateTo")?.trim() || "",
    },
  };
}

export function serializeFlashSaleHistoryQuery(state: FlashSaleHistoryQueryState) {
  const searchParams = new URLSearchParams();

  if (state.page > DEFAULT_FLASH_SALE_HISTORY_PAGE) {
    searchParams.set("page", String(state.page));
  }

  if (state.limit !== DEFAULT_FLASH_SALE_HISTORY_LIMIT) {
    searchParams.set("limit", String(state.limit));
  }

  if (state.filters.executionId !== undefined) {
    searchParams.set("executionId", String(state.filters.executionId));
  }

  if (state.filters.search) {
    searchParams.set("search", state.filters.search);
  }

  if (state.filters.status) {
    searchParams.set("status", state.filters.status);
  }

  if (state.filters.dateFrom) {
    searchParams.set("dateFrom", state.filters.dateFrom);
  }

  if (state.filters.dateTo) {
    searchParams.set("dateTo", state.filters.dateTo);
  }

  return searchParams;
}

function toIsoDateStart(date: string) {
  return new Date(`${date}T00:00:00`).toISOString();
}

function toIsoDateEnd(date: string) {
  return new Date(`${date}T23:59:59.999`).toISOString();
}

export function toFlashSaleHistoryRequestParams(state: FlashSaleHistoryQueryState) {
  return {
    page: state.page,
    limit: state.limit,
    executionId: state.filters.executionId,
    search: state.filters.search || undefined,
    status: state.filters.status || undefined,
    dateFrom: state.filters.dateFrom ? toIsoDateStart(state.filters.dateFrom) : undefined,
    dateTo: state.filters.dateTo ? toIsoDateEnd(state.filters.dateTo) : undefined,
  };
}

export function mapFlashSaleHistoryItemToRow(item: FlashSaleHistoryItem): FlashSaleHistoryTableRow {
  return {
    id: item.id,
    createdAt: item.createdAt,
    executionLabel: `#${item.executionId}`,
    sourceFlashSaleLabel: `#${item.sourceFlashSaleId}`,
    targetFlashSaleLabel: item.targetFlashSaleId ? `#${item.targetFlashSaleId}` : "-",
    flashSaleName: item.flashSaleName || "-",
    targetDate: item.targetDate,
    status: item.status,
    errorMessage: compactMessage(item.errorMessage, "-"),
  };
}