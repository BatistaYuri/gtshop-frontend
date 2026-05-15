"use client";

import { useCallback, useState, useTransition } from "react";
import { toErrorMessage } from "@/lib/errors";
import { jobsService } from "@/services/jobs-service";
import type { RunNowResponse } from "@/types/api";

export function useRunStockUpdate(options?: { onCompleted?: () => Promise<void> | void }) {
  const [feedback, setFeedback] = useState<{ type: "success" | "warning" | "error"; message: string } | null>(null);
  const [isRunning, startRunning] = useTransition();

  const runNow = useCallback(() => {
    setFeedback(null);

    return new Promise<RunNowResponse>((resolve, reject) => {
      startRunning(async () => {
        try {
          const response = await jobsService.runNow();
          const normalizedStatus = (response.status || response.result || "").toLowerCase();
          const variant = response.partialFailure || normalizedStatus.includes("partial") ? "warning" : "success";
          const message = response.message ||
            (variant === "warning"
              ? "Execucao concluida com falhas parciais. Confira os detalhes da ultima execucao."
              : "Rotina de atualizacao executada com sucesso.");

          setFeedback({ type: variant, message });

          if (options?.onCompleted) {
            await options.onCompleted();
          }

          resolve(response);
        } catch (error) {
          const message = toErrorMessage(error, "Nao foi possivel executar a atualizacao manual.");
          setFeedback({ type: "error", message });
          reject(error);
        }
      });
    });
  }, [options]);

  return {
    isRunning,
    feedback,
    runNow,
    clearFeedback: () => setFeedback(null),
  };
}