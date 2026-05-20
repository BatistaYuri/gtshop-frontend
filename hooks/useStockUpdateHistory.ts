"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { jobsService, type StockUpdateHistoryParams } from "@/services/jobs-service";
import type { PaginatedStockHistory } from "@/types/api";

export function useStockUpdateHistory(params: StockUpdateHistoryParams) {
  const [data, setData] = useState<PaginatedStockHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paramsRef = useRef(params);

  const load = useCallback(async (currentParams: StockUpdateHistoryParams) => {
    setError(null);

    try {
      const response = await jobsService.getStockUpdateHistory(currentParams);
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar o historico de atualizacao de estoque."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    paramsRef.current = params;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    setIsLoading(true);

    debounceRef.current = setTimeout(() => {
      load(paramsRef.current);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [params, load]);

  const refresh = useCallback(() => {
    setIsLoading(true);
    load(paramsRef.current);
  }, [load]);

  return { data, isLoading, error, refresh };
}