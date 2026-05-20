"use client";

import { apiRequest } from "@/lib/api-client";
import type {
  ExecutionSummary,
  LatestJobExecutionResponse,
  PaginatedStockHistory,
  RunNowResponse,
} from "@/types/api";

export interface StockUpdateHistoryParams {
  page?: number;
  limit?: number;
  executionId?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  stockChange?: "positive" | "negative";
}

export const jobsService = {
  getLatestExecution() {
    return apiRequest<LatestJobExecutionResponse | null>("/jobs/update-stock/latest");
  },
  runNow() {
    return apiRequest<RunNowResponse>("/jobs/update-stock/run-now", {
      method: "POST",
    });
  },
  getStockUpdateHistory(params: StockUpdateHistoryParams = {}) {
    const searchParams = new URLSearchParams();

    if (params.page !== undefined) searchParams.set("page", String(params.page));
    if (params.limit !== undefined) searchParams.set("limit", String(params.limit));
    if (params.executionId !== undefined) searchParams.set("executionId", String(params.executionId));
    if (params.search) searchParams.set("search", params.search);
    if (params.dateFrom) searchParams.set("dateFrom", params.dateFrom);
    if (params.dateTo) searchParams.set("dateTo", params.dateTo);
    if (params.stockChange) searchParams.set("stockChange", params.stockChange);

    const queryString = searchParams.toString();
    const url = `/jobs/update-stock/history${queryString ? `?${queryString}` : ""}`;

    return apiRequest<PaginatedStockHistory>(url);
  },
  getExecutionsList() {
    return apiRequest<ExecutionSummary[]>("/jobs/update-stock/executions");
  },
};
