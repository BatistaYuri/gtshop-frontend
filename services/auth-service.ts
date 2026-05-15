"use client";

import { apiRequest } from "@/lib/api-client";
import type { AuthUser, LoginRequest, LoginResponse } from "@/types/api";

export const authService = {
  login(payload: LoginRequest) {
    return apiRequest<LoginResponse>("/auth/login", {
      method: "POST",
      body: payload,
      requiresAuth: false,
    });
  },
  getMe() {
    return apiRequest<AuthUser>("/auth/me");
  },
};