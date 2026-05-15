"use client";

import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { jobsService } from "@/services/jobs-service";
import type { LatestJobExecutionResponse } from "@/types/api";

export function useLatestExecution() {
  const [data, setData] = useState<LatestJobExecutionResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);

    try {
      const response = await jobsService.getLatestExecution();
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar a ultima execucao."));
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