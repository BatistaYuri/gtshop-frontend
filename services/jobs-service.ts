"use client";

import { apiRequest } from "@/lib/api-client";
import type { LatestJobExecutionResponse, RunNowResponse } from "@/types/api";

export const jobsService = {
  getLatestExecution() {
    return apiRequest<LatestJobExecutionResponse | null>("/jobs/update-stock/latest");
  },
  runNow() {
    return apiRequest<RunNowResponse>("/jobs/update-stock/run-now", {
      method: "POST",
    });
  },
};