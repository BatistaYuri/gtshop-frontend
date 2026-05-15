"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { toErrorMessage } from "@/lib/errors";
import { shopeeService } from "@/services/shopee-service";
import type { ShopeeStatusResponse } from "@/types/api";

export function useShopeeStatus() {
  const [data, setData] = useState<ShopeeStatusResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [isRefreshingToken, startRefreshingToken] = useTransition();
  const [isConnecting, setIsConnecting] = useState(false);

  const load = useCallback(async () => {
    setError(null);

    try {
      const response = await shopeeService.getStatus();
      setData(response);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel carregar o status da Shopee."));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => load());
  }, [load]);

  const connect = useCallback(async () => {
    setFeedback(null);
    setIsConnecting(true);

    try {
      const response = await shopeeService.getAuthUrl();
      const url = typeof response === "string" ? response : response.url;

      if (!url) {
        throw new Error("A API nao retornou uma URL valida para autorizacao.");
      }

      window.location.assign(url);
    } catch (nextError) {
      setFeedback({ type: "error", message: toErrorMessage(nextError, "Nao foi possivel iniciar a conexao com a Shopee.") });
      setIsConnecting(false);
    }
  }, []);

  const refreshToken = useCallback(() => {
    setFeedback(null);

    return new Promise<void>((resolve, reject) => {
      startRefreshingToken(async () => {
        try {
          const response = await shopeeService.refreshToken();
          const message =
            (typeof response === "object" && "message" in response && typeof response.message === "string"
              ? response.message
              : undefined) || "Token Shopee atualizado com sucesso.";

          await load();
          setFeedback({ type: "success", message });
          resolve();
        } catch (nextError) {
          const message = toErrorMessage(nextError, "Nao foi possivel atualizar o token da Shopee.");
          setFeedback({ type: "error", message });
          reject(nextError);
        }
      });
    });
  }, [load]);

  return {
    data,
    isLoading,
    error,
    feedback,
    isRefreshingToken,
    isConnecting,
    refresh: load,
    connect,
    refreshToken,
    clearFeedback: () => setFeedback(null),
  };
}