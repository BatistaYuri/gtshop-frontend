"use client";

import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { jobsService } from "@/services/jobs-service";
import type { ExecutionSummary } from "@/types/api";

export function useExecutionsList() {
  const [data, setData] = useState<ExecutionSummary[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);

    try {
      const response = await jobsService.getExecutionsList();
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar a lista de execucoes."));
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