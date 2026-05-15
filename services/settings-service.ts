"use client";

import { apiRequest } from "@/lib/api-client";
import type { SettingsResponse, UpdateStockAutomationRequest } from "@/types/api";

export const settingsService = {
  getSettings() {
    return apiRequest<SettingsResponse>("/settings");
  },
  updateStockAutomation(payload: UpdateStockAutomationRequest) {
    return apiRequest<SettingsResponse>("/settings/stock-automation", {
      method: "PATCH",
      body: payload,
    });
  },
};