"use client";

import { apiRequest } from "@/lib/api-client";
import type {
  ShopeeAuthUrlResponse,
  ShopeeCallbackPayload,
  ShopeeCallbackResponse,
  ShopeeStatusResponse,
} from "@/types/api";

export const shopeeService = {
  getAuthUrl() {
    return apiRequest<ShopeeAuthUrlResponse | string>("/shopee/auth/url");
  },
  getStatus() {
    return apiRequest<ShopeeStatusResponse>("/shopee/status");
  },
  refreshToken() {
    return apiRequest<ShopeeStatusResponse | { message?: string }>("/shopee/refresh-token", {
      method: "POST",
    });
  },
  submitCallback(payload: ShopeeCallbackPayload) {
    return apiRequest<ShopeeCallbackResponse>("/shopee/callback", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },
};