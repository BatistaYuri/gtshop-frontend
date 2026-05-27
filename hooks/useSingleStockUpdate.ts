"use client";

import { useCallback, useState, useTransition } from "react";
import { toErrorMessage } from "@/lib/errors";
import { jobsService } from "@/services/jobs-service";
import type {
  ProductItem,
  ProductModel,
  SingleStockUpdateResponse,
} from "@/types/api";

interface SingleStockUpdateFeedback {
  type: "success" | "warning" | "error";
  message: string;
}

export function useSingleStockUpdate() {
  const [products, setProducts] = useState<ProductItem[] | null>(null);
  const [models, setModels] = useState<ProductModel[] | null>(null);
  const [isLoadingProducts, startLoadingProducts] = useTransition();
  const [isLoadingModels, startLoadingModels] = useTransition();
  const [isUpdating, startUpdating] = useTransition();
  const [productsLoadError, setProductsLoadError] = useState<string | null>(null);
  const [modelsLoadError, setModelsLoadError] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<SingleStockUpdateFeedback | null>(null);

  const loadProducts = useCallback(() => {
    setProductsLoadError(null);

    startLoadingProducts(async () => {
      try {
        const data = await jobsService.getProducts();
        setProducts(data);
      } catch (error) {
        const message = toErrorMessage(error, "Nao foi possivel carregar a lista de produtos.");
        setProductsLoadError(message);
      }
    });
  }, []);

  const loadModels = useCallback((itemId: number) => {
    setModelsLoadError(null);
    setModels(null);

    startLoadingModels(async () => {
      try {
        const data = await jobsService.getProductModels(itemId);
        setModels(data);
      } catch (error) {
        const message = toErrorMessage(error, "Nao foi possivel carregar os modelos do produto.");
        setModelsLoadError(message);
      }
    });
  }, []);

  const update = useCallback((payload: {
    itemId: number;
    modelId?: number;
    stockTarget?: number;
  }) => {
    setFeedback(null);

    return new Promise<SingleStockUpdateResponse>((resolve, reject) => {
      startUpdating(async () => {
        try {
          const response = await jobsService.updateSingleStock(payload);

          if (response.skipped) {
            setFeedback({
              type: "warning",
              message: `Produto ignorado (estoque alvo: ${response.stockTarget}).`,
            });
          } else {
            const status = (response.execution?.status || "").toLowerCase();
            const isPartial = response.execution?.partialFailure || status.includes("partial");
            const variant = isPartial ? "warning" : "success";
            const message = isPartial
              ? "Atualizacao concluida com falhas parciais."
              : "Estoque atualizado com sucesso.";

            setFeedback({ type: variant, message });
          }

          resolve(response);
        } catch (error) {
          const message = toErrorMessage(error, "Nao foi possivel atualizar o estoque.");
          setFeedback({ type: "error", message });
          reject(error);
        }
      });
    });
  }, []);

  return {
    products,
    models,
    isLoadingProducts,
    isLoadingModels,
    isUpdating,
    productsLoadError,
    modelsLoadError,
    feedback,
    loadProducts,
    loadModels,
    update,
  };
}