"use client";

import { apiRequest } from "@/lib/api-client";
import type {
  ActiveFlashSale,
  FlashSaleExecutionSummary,
  FlashSaleHistoryStatus,
  FlashSaleExecution,
  FlashSaleReplicationResponse,
  LatestShopeeFlashSaleExecution,
  PaginatedFlashSaleHistory,
  ReplicationResult,
} from "@/types/api";

export interface FlashSaleHistoryParams {
  page?: number;
  limit?: number;
  executionId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  status?: FlashSaleHistoryStatus;
}

export const flashSalesService = {
  getLatestExecution() {
    return apiRequest<FlashSaleExecution | null>("/jobs/flash-sales/latest");
  },
  replicateNextDay() {
    return apiRequest<FlashSaleReplicationResponse>("/jobs/flash-sales/replicate-next-day", {
      method: "POST",
    });
  },

  // --- New Shopee flash-sales endpoints ---

  /** GET /shopee/flash-sales/active — list currently active campaigns */
  getActiveFlashSales() {
    return apiRequest<ActiveFlashSale[]>("/shopee/flash-sales/active");
  },

  /** POST /shopee/flash-sales/replicate/:id — replicate a specific campaign to next day */
  replicateFlashSale(id: number) {
    return apiRequest<ReplicationResult>(`/shopee/flash-sales/replicate/${id}`, {
      method: "POST",
    });
  },

  /** GET /shopee/flash-sales/latest-execution — check latest execution status (may be null) */
  getLatestShopeeExecution() {
    return apiRequest<LatestShopeeFlashSaleExecution | null>("/shopee/flash-sales/latest-execution");
  },

  /** GET /shopee/flash-sales/history — paginated replication history */
  getHistory(params: FlashSaleHistoryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.set("page", String(params.page));
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.executionId !== undefined) searchParams.set("executionId", String(params.executionId));
    if (params.search) searchParams.set("search", params.search);
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);
    if (params.status) searchParams.set("status", params.status);

    const queryString = searchParams.toString();
    const url = `/shopee/flash-sales/history${queryString ? `?${queryString}` : ""}`;

    return apiRequest<PaginatedFlashSaleHistory>(url);
  },

  /** GET /shopee/flash-sales/executions — list available executions for filtering */
  getExecutions() {
    return apiRequest<FlashSaleExecutionSummary[]>("/shopee/flash-sales/executions");
  },
};
