"use client";

import { useCallback, useRef, useState } from "react";
import { toErrorMessage } from "@/lib/errors";
import { flashSalesService } from "@/services/flash-sales-service";
import type { ReplicationResult } from "@/types/api";

type ReplicationFeedback = {
  type: "success" | "warning" | "error";
  message: string;
};

function getFeedbackMessage(result: ReplicationResult): ReplicationFeedback {
  if (result.skipped) {
    return {
      type: "warning",
      message: result.reason || "Replicacao ignorada.",
    };
  }

  if (result.errors.length > 0) {
    return {
      type: "warning",
      message: "Replicacao concluida com alertas. Confira os detalhes abaixo.",
    };
  }

  return {
    type: "success",
    message: `Oferta relampago replicada para ${result.targetDate} com sucesso.`,
  };
}

export function useReplicateFlashSale() {
  const inFlightRef = useRef(false);
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<ReplicationResult | null>(null);
  const [feedback, setFeedback] = useState<ReplicationFeedback | null>(null);

  const runReplication = useCallback(async (flashSaleId: number) => {
    if (inFlightRef.current) {
      return null;
    }

    inFlightRef.current = true;
    setIsRunning(true);
    setFeedback(null);
    setResult(null);

    try {
      const response = await flashSalesService.replicateFlashSale(flashSaleId);
      setResult(response);
      setFeedback(getFeedbackMessage(response));
      return response;
    } catch (error) {
      setResult(null);
      setFeedback({
        type: "error",
        message: toErrorMessage(error, "Nao foi possivel replicar a oferta relampago agora."),
      });
      throw error;
    } finally {
      inFlightRef.current = false;
      setIsRunning(false);
    }
  }, []);

  return {
    feedback,
    isRunning,
    result,
    runReplication,
  };
}