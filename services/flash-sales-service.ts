"use client";

import { apiRequest } from "@/lib/api-client";
import type { FlashSaleExecution, FlashSaleReplicationResponse } from "@/types/api";

export const flashSalesService = {
  getLatestExecution() {
    return apiRequest<FlashSaleExecution | null>("/jobs/flash-sales/latest");
  },
  replicateNextDay() {
    return apiRequest<FlashSaleReplicationResponse>("/jobs/flash-sales/replicate-next-day", {
      method: "POST",
    });
  },
};