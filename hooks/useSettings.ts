"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toErrorMessage } from "@/lib/errors";
import { settingsService } from "@/services/settings-service";
import type { SettingsResponse, UpdateStockAutomationRequest } from "@/types/api";

export function useSettings() {
  const [data, setData] = useState<SettingsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isSaving, startSaving] = useTransition();

  const load = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);

    try {
      const response = await settingsService.getSettings();
      setData(response);
    } catch (error) {
      setLoadError(toErrorMessage(error, "Nao foi possivel carregar as configuracoes de estoque."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => load());
  }, [load]);

  const save = useCallback((payload: UpdateStockAutomationRequest) => {
    setFeedback(null);

    return new Promise<SettingsResponse>((resolve, reject) => {
      startSaving(async () => {
        try {
          const response = await settingsService.updateStockAutomation(payload);
          setData(response);
          setFeedback({ type: "success", message: "Configuracoes de estoque salvas com sucesso." });
          resolve(response);
        } catch (error) {
          const message = toErrorMessage(error, "Nao foi possivel salvar as configuracoes de estoque.");
          setFeedback({ type: "error", message });
          reject(error);
        }
      });
    });
  }, []);

  return {
    data,
    isLoading,
    isSaving,
    loadError,
    feedback,
    load,
    save,
    clearFeedback: () => setFeedback(null),
  };
}