"use client";

import { apiRequest } from "@/lib/api-client";
import type { ReportsOverviewResponse, ReportsPeriodDays, ReportsTimelineResponse } from "@/types/api";

const ALLOWED_PERIODS: readonly ReportsPeriodDays[] = [7, 30, 90];

function normalizeDays(days: ReportsPeriodDays) {
  return ALLOWED_PERIODS.includes(days) ? days : 30;
}

export const reportsService = {
  getOverview(days: ReportsPeriodDays) {
    const period = normalizeDays(days);
    return apiRequest<ReportsOverviewResponse>(`/jobs/reports/overview?days=${period}`);
  },
  getTimeline(days: ReportsPeriodDays) {
    const period = normalizeDays(days);
    return apiRequest<ReportsTimelineResponse>(`/jobs/reports/timeline?days=${period}`);
  },
};
