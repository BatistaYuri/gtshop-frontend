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
  flashSaleAutomationEnabled: boolean;
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

export interface UpdateFlashSaleAutomationPayload {
  enabled: boolean;
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
  [key: string]: unknown;
}

/**
 * Represents an item in the `created` array of the POST /api/jobs/flash-sales/replicate-next-day response.
 *
 * The API now uses Flash Sale naming (sourceFlashSaleId, targetFlashSaleId, flashSaleName)
 * instead of Discount naming.
 */
export interface FlashSaleReplicationCreatedItem {
  sourceFlashSaleId: number;
  targetFlashSaleId: number;
  flashSaleName: string;
}

/**
 * Represents a created discount persisted inside a FlashSaleExecution.
 *
 * The database still uses Discount naming (sourceDiscountId, targetDiscountId, discountName).
 * No migration was performed, so these field names remain unchanged.
 */
export interface FlashSaleReplicationCreatedCampaign {
  sourceDiscountId: number;
  targetDiscountId: number;
  discountName: string;
}

export interface FlashSaleExecution {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  status: "RUNNING" | "SUCCESS" | "ERROR" | "PARTIAL_SUCCESS";
  targetDate: string;
  sourceCampaigns: number;
  createdCampaigns: number;
  skippedCampaigns: number;
  createdDiscounts: FlashSaleReplicationCreatedCampaign[];
  errorsCount: number;
  errorMessage: string | null;
  createdAt: string;
}

export interface FlashSaleReplicationResponse {
  skipped: boolean;
  targetDate: string;
  sourceCampaigns: number;
  createdCampaigns: number;
  skippedCampaigns: number;
  created: FlashSaleReplicationCreatedItem[];
  errors: string[];
  execution: FlashSaleExecution | null;
}

// --- New types for the /shopee/flash-sales endpoints ---

export interface ActiveFlashSale {
  flashSaleId: number;
  flashSaleName: string;
  startTime: number; // Unix seconds — multiply by 1000 for JS Date
  endTime: number;   // Unix seconds
  status?: number;
}

export interface ReplicationExecutionResult {
  id: number;
  status: "SUCCESS" | "PARTIAL_SUCCESS" | "ERROR";
  targetDate: string;         // "YYYY-MM-DD"
  createdCampaigns: number;   // 0 or 1
  errorsCount: number;
  errorMessage: string | null;
}

export interface ReplicationResult {
  skipped: boolean;
  reason?: string;
  execution?: ReplicationExecutionResult;
  targetDate: string;
  createdCampaigns: number;
  errors: string[];
}

export interface LatestShopeeFlashSaleExecution {
  id: number;
  status: "RUNNING" | "SUCCESS" | "PARTIAL_SUCCESS" | "ERROR";
  targetDate: string;
  createdCampaigns: number;
  errorMessage: string | null;
  createdAt: string;
}

export type FlashSaleHistoryStatus = "SUCCESS" | "ERROR" | "SKIPPED";

export interface FlashSaleHistoryItem {
  id: number;
  executionId: number;
  userId: number;
  sourceFlashSaleId: number;
  targetFlashSaleId: number | null;
  flashSaleName: string;
  targetDate: string;
  status: FlashSaleHistoryStatus;
  errorMessage: string | null;
  createdAt: string;
}

export interface PaginatedFlashSaleHistory {
  items: FlashSaleHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface FlashSaleExecutionSummary {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  sourceCampaigns: number;
  createdCampaigns: number;
  skippedCampaigns: number;
  targetDate: string;
}

// --- End new types ---

export interface StockUpdateHistoryItem {
  id: number;
  executionId: number;
  userId: number;
  itemId: number;
  modelId: number | null;
  productName: string;
  modelName: string;
  stockBefore: number;
  stockAfter: number;
  stockChange: number;
  createdAt: string;
}

export interface PaginatedStockHistory {
  items: StockUpdateHistoryItem[];
  total: number;
  page: number;
  limit: number;
}

export interface ExecutionSummary {
  id: number;
  startedAt: string;
  finishedAt: string | null;
  status: string;
  productsUpdated: number;
}

export interface ProductItem {
  itemId: number;
  itemName: string;
  itemStatus: string;
  hasModel: boolean;
}

export interface ProductModelSellerStock {
  sellerName: string;
  stock: number;
}

export interface ProductModel {
  modelId: number;
  modelName: string;
  stock: number;
  sellerStocks: ProductModelSellerStock[];
}

export interface SingleStockUpdatePayload {
  itemId: number;
  modelId?: number;
  stockTarget?: number;
}

export interface SingleStockUpdateResponse {
  skipped: boolean;
  execution: LatestJobExecutionResponse | null;
  stockTarget: number;
}

export interface ApiErrorResponse {
  message?: string;
  error?: string;
  statusCode?: number;
  details?: unknown;
}

export type ReportsPeriodDays = 7 | 30 | 90;

export interface ReportsExecutionCounters {
  total?: number;
  success?: number;
  partialSuccess?: number;
  error?: number;
}

export interface ReportsDurationsMs {
  avgTotal?: number;
  p95Total?: number;
  maxTotal?: number;
}

export interface ReportsStockOverview {
  executions?: ReportsExecutionCounters;
  counters?: {
    entitiesConsidered?: number;
    updatesSent?: number;
    updatesSucceeded?: number;
    noOpSkipped?: number;
    errors?: number;
  };
  apiCalls?: {
    getActiveProducts?: number;
    getModels?: number;
    getItemStockInfo?: number;
    updateProductStock?: number;
  };
  durationsMs?: ReportsDurationsMs;
  latestExecutionAt?: string | null;
}

export interface ReportsFlashSaleOverview {
  executions?: ReportsExecutionCounters;
  counters?: {
    sourceCampaigns?: number;
    createdCampaigns?: number;
    skippedCampaigns?: number;
    skippedBecauseDuplicate?: number;
    skippedBecauseNoItems?: number;
    addItemsRequests?: number;
    addItemsRequestedItems?: number;
    addItemsVerifiedPresentAfterFailure?: number;
    errors?: number;
  };
  apiCalls?: {
    listCampaigns?: number;
    getFlashSale?: number;
    getFlashSaleItems?: number;
    getTimeSlotId?: number;
    createShopFlashSale?: number;
    addShopFlashSaleItems?: number;
    verifyFlashSaleItemIds?: number;
  };
  retries?: {
    networkRetries?: number;
  };
  durationsMs?: ReportsDurationsMs;
  latestExecutionAt?: string | null;
}

export interface ReportsOverviewResponse {
  periodDays?: number;
  stock?: ReportsStockOverview;
  flashSale?: ReportsFlashSaleOverview;
}

export interface ReportsTimelineItem {
  day: string;
  stock_updates_succeeded?: number;
  stock_no_op_skipped?: number;
  stock_errors?: number;
  flash_created_campaigns?: number;
  flash_skipped_campaigns?: number;
  flash_errors?: number;
}

export interface ReportsTimelineResponse {
  periodDays?: number;
  items?: ReportsTimelineItem[];
}