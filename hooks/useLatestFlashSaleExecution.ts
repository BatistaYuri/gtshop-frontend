"use client";

import { useCallback, useEffect, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { flashSalesService } from "@/services/flash-sales-service";
import type { FlashSaleExecution } from "@/types/api";

export function useLatestFlashSaleExecution() {
  const [data, setData] = useState<FlashSaleExecution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setError(null);

    try {
      const response = await flashSalesService.getLatestExecution();
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar a ultima atualizacao de oferta relampago."));
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