"use client";

import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { healthService } from "@/services/health-service";
import type { HealthResponse } from "@/types/api";

export function useHealth() {
  const [data, setData] = useState<HealthResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const response = await healthService.getHealth();
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel verificar o health da API."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => load());
  }, [load]);

  return {
    data,
    isLoading,
    error,
    refresh: load,
  };
}