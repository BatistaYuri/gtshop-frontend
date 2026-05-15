export interface AuthUser {
  id: number;
  username: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
}

export interface SettingsResponse {
  companyName: string;
  stockAutomationEnabled: boolean;
  stockAutomationProductIds: number[];
  stockAutomationStatuses: string[];
  stockAutomationStockTarget: number;
}

export interface UpdateStockAutomationRequest {
  enabled?: boolean;
  productIds?: number[];
  statuses?: string[];
  stockTarget?: number;
}

export interface ShopeeAuthUrlResponse {
  url: string;
}

export interface ShopeeStatusResponse {
  connected?: boolean;
  isConnected?: boolean;
  authorized?: boolean;
  status?: string;
  shopId?: string | number | null;
  shopName?: string | null;
  message?: string | null;
  accessTokenExpiresAt?: string | null;
  refreshTokenExpiresAt?: string | null;
  lastSyncAt?: string | null;
  [key: string]: unknown;
}

export interface ShopeeCallbackPayload {
  code: string;
  shopId: number;
}

export interface ShopeeCallbackResponse {
  success?: boolean | string | number;
  status?: string;
  message?: string | null;
  connected?: boolean;
  shopId?: string | number | null;
  shopName?: string | null;
  [key: string]: unknown;
}

export interface LatestJobExecutionResponse {
  id?: string | number;
  status?: string;
  result?: string;
  message?: string | null;
  updatedProductsCount?: number | null;
  productsUpdated?: number | null;
  totalUpdated?: number | null;
  partialFailure?: boolean;
  error?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  [key: string]: unknown;
}

export interface RunNowResponse {
  status?: string;
  result?: string;
  message?: string;
  updatedProductsCount?: number | null;
  partialFailure?: boolean;
  error?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
  [key: string]: unknown;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  details?: unknown;
}

export interface HealthResponse {
  status: "ok" | string;
}