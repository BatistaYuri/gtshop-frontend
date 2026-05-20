"use client";

import { useCallback, useRef, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { flashSalesService } from "@/services/flash-sales-service";
import type { FlashSaleExecution, FlashSaleReplicationResponse } from "@/types/api";

type FlashSalesFeedback = {
  type: "success" | "warning" | "error";
  message: string;
};

function getSuccessMessage(result: FlashSaleReplicationResponse) {
  if (result.skipped && result.createdCampaigns === 0) {
    return "Nenhuma nova oferta precisou ser replicada para amanha.";
  }

  if (result.errors.length > 0) {
    return "Replicacao concluida com alertas. Confira os detalhes abaixo.";
  }

  return "Ofertas relampago replicadas com sucesso para amanha.";
}

export function useReplicateFlashSales(options?: { onCompleted?: (execution: FlashSaleExecution | null) => void }) {
  const inFlightRef = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<FlashSaleReplicationResponse | null>(null);
  const [feedback, setFeedback] = useState<FlashSalesFeedback | null>(null);

  const runReplication = useCallback(async () => {
    if (inFlightRef.current) {
      return null;
    }

    inFlightRef.current = true;
    setIsRunning(true);
    setFeedback(null);

    try {
      const response = await flashSalesService.replicateNextDay();
      setResult(response);
      setFeedback({
        type: response.errors.length > 0 || (response.skipped && response.createdCampaigns === 0) ? "warning" : "success",
        message: getSuccessMessage(response),
      });
      options?.onCompleted?.(response.execution);

      return response;
    } catch (error) {
      setResult(null);
      setFeedback({
        type: "error",
        message: toErrorMessage(error, "Nao foi possivel replicar as ofertas relampago agora."),
      });
      throw error;
    } finally {
      inFlightRef.current = false;
      setIsRunning(false);
    }
  }, [options]);

  return {
    feedback,
    isRunning,
    result,
    runReplication,
  };
}