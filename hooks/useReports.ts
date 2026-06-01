"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { reportsService } from "@/services/reports-service";
import type {
  ReportsOverviewResponse,
  ReportsPeriodDays,
  ReportsTimelineItem,
} from "@/types/api";

const CACHE_TTL_MS = 30_000;

export interface ReportsTimelinePoint {
  day: string;
  stockUpdatesSucceeded: number;
  stockNoOpSkipped: number;
  stockErrors: number;
  flashCreatedCampaigns: number;
  flashSkippedCampaigns: number;
  flashErrors: number;
}

type ReportsBundle = {
  overview: ReportsOverviewResponse;
  timeline: ReportsTimelinePoint[];
};

const reportsCache = new Map<ReportsPeriodDays, { expiresAt: number; bundle: ReportsBundle }>();

function toSafeNumber(value: number | undefined) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value);
}

function normalizeTimelineItems(items: ReportsTimelineItem[] | undefined) {
  if (!items?.length) {
    return [];
  }

  return items
    .map((item) => ({
      day: item.day,
      stockUpdatesSucceeded: toSafeNumber(item.stock_updates_succeeded),
      stockNoOpSkipped: toSafeNumber(item.stock_no_op_skipped),
      stockErrors: toSafeNumber(item.stock_errors),
      flashCreatedCampaigns: toSafeNumber(item.flash_created_campaigns),
      flashSkippedCampaigns: toSafeNumber(item.flash_skipped_campaigns),
      flashErrors: toSafeNumber(item.flash_errors),
    }))
    .sort((left, right) => left.day.localeCompare(right.day));
}

async function loadReportsBundle(days: ReportsPeriodDays) {
  const [overview, timeline] = await Promise.all([
    reportsService.getOverview(days),
    reportsService.getTimeline(days),
  ]);

  return {
    overview: {
      ...overview,
      periodDays: overview.periodDays ?? days,
    },
    timeline: normalizeTimelineItems(timeline.items),
  } satisfies ReportsBundle;
}

export function useReports(initialDays: ReportsPeriodDays = 30) {
  const [days, setDays] = useState<ReportsPeriodDays>(initialDays);
  const [overview, setOverview] = useState<ReportsOverviewResponse | null>(null);
  const [timeline, setTimeline] = useState<ReportsTimelinePoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestIdRef = useRef(0);

  const load = useCallback(async (nextDays: ReportsPeriodDays, force = false) => {
    const cached = reportsCache.get(nextDays);

    if (!force && cached && cached.expiresAt > Date.now()) {
      setOverview(cached.bundle.overview);
      setTimeline(cached.bundle.timeline);
      setError(null);
      setIsLoading(false);
      setIsRefreshing(false);
      return;
    }

    const hasScreenData = overview !== null || timeline.length > 0;

    if (hasScreenData) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }

    setError(null);
    const requestId = requestIdRef.current + 1;
    requestIdRef.current = requestId;

    try {
      const bundle = await loadReportsBundle(nextDays);

      if (requestIdRef.current !== requestId) {
        return;
      }

      setOverview(bundle.overview);
      setTimeline(bundle.timeline);
      reportsCache.set(nextDays, {
        expiresAt: Date.now() + CACHE_TTL_MS,
        bundle,
      });
    } catch (nextError) {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setError(toErrorMessage(nextError, "Nao foi possivel carregar os relatorios operacionais."));
    } finally {
      if (requestIdRef.current !== requestId) {
        return;
      }

      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [overview, timeline.length]);

  useEffect(() => {
    Promise.resolve().then(() => load(days));
  }, [days, load]);

  const refresh = useCallback(() => {
    return load(days, true);
  }, [days, load]);

  return {
    days,
    setDays,
    overview,
    timeline,
    isLoading,
    isRefreshing,
    error,
    refresh,
  };
}
