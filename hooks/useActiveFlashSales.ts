"use client";

import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { flashSalesService } from "@/services/flash-sales-service";
import type { ActiveFlashSale } from "@/types/api";

export function useActiveFlashSales() {
  const [data, setData] = useState<ActiveFlashSale[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);
    setIsLoading(true);

    try {
      const response = await flashSalesService.getActiveFlashSales();
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar as ofertas relampago ativas."));
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