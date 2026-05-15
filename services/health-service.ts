"use client";

import { apiRequest } from "@/lib/api-client";
import type { HealthResponse } from "@/types/api";

export const healthService = {
  getHealth() {
    return apiRequest<HealthResponse>("/health", { requiresAuth: false });
  },
};