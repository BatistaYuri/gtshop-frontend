"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { flashSalesService, type FlashSaleHistoryParams } from "@/services/flash-sales-service";
import type { PaginatedFlashSaleHistory } from "@/types/api";

export function useFlashSaleHistory(params: FlashSaleHistoryParams) {
  const [data, setData] = useState<PaginatedFlashSaleHistory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const paramsRef = useRef(params);

  const load = useCallback(async (currentParams: FlashSaleHistoryParams) => {
    setError(null);

    try {
      const response = await flashSalesService.getHistory(currentParams);
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar o historico de replicacao de oferta relampago."));
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

  return {
    data,
    isLoading,
    error,
    refresh,
  };
}