"use client";

import { Search, Save } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { InlineLoading } from "@/components/ui/inline-loading";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useSingleStockUpdate } from "@/hooks/useSingleStockUpdate";

interface SingleStockUpdateProps {
  defaultStockTarget: number;
}

export function SingleStockUpdate({ defaultStockTarget }: SingleStockUpdateProps) {
  const {
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
  } = useSingleStockUpdate();

  const [selectedItemId, setSelectedItemId] = useState<number | "">("");
  const [selectedModelId, setSelectedModelId] = useState<number | "">("");
  const [stockTarget, setStockTarget] = useState(String(defaultStockTarget));
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const selectedProduct = useMemo(() => {
    if (selectedItemId === "") return null;
    return products?.find((p) => p.itemId === selectedItemId) ?? null;
  }, [products, selectedItemId]);

  const filteredProducts = useMemo(() => {
    if (!products) return [];
    if (!searchQuery.trim()) return products;
    const q = searchQuery.toLowerCase();
    return products.filter(
      (p) =>
        p.itemName.toLowerCase().includes(q) ||
        String(p.itemId).includes(q),
    );
  }, [products, searchQuery]);

  function handleProductChange(itemId: number) {
    setSelectedItemId(itemId);
    setSelectedModelId("");

    const product = products?.find((p) => p.itemId === itemId);

    if (product?.hasModel) {
      loadModels(itemId);
    }
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (selectedItemId === "") return;

    await update({
      itemId: selectedItemId,
      modelId: selectedModelId !== "" ? selectedModelId : undefined,
      stockTarget: stockTarget !== "" ? Number(stockTarget) : undefined,
    });
  }

  const canSubmit = selectedItemId !== "" && !isUpdating;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Atualizacao individual</CardTitle>
        <CardDescription>
          Selecione um produto para atualizar o estoque manualmente.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0 pb-5">
        <FeedbackAlert feedback={feedback} />

        {productsLoadError ? (
          <Alert variant="danger" message={productsLoadError} />
        ) : null}

        {isLoadingProducts ? (
          <InlineLoading label="Carregando produtos..." />
        ) : (
          <form className="space-y-4" onSubmit={handleSubmit}>
            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-foreground">Produto</span>
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-foreground-soft/70" />
                <input
                  type="text"
                  className="field-shell h-10 w-full rounded-2xl pl-9 pr-3.5 text-sm text-foreground outline-none placeholder:text-foreground-soft/70"
                  placeholder="Buscar produto..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <select
                className="field-shell h-10 w-full rounded-2xl px-3.5 text-sm text-foreground outline-none mt-2"
                value={selectedItemId}
                onChange={(e) => handleProductChange(Number(e.target.value))}
              >
                <option value="" disabled>
                  Selecione um produto
                </option>
                {filteredProducts.map((product) => (
                  <option key={product.itemId} value={product.itemId}>
                    {product.itemName} ({product.itemStatus})
                    {product.hasModel ? " [com modelo]" : ""}
                  </option>
                ))}
              </select>
            </label>

            {selectedProduct?.hasModel ? (
              <label className="block space-y-1.5">
                <span className="text-sm font-semibold text-foreground">Modelo</span>
                {modelsLoadError ? (
                  <Alert variant="danger" message={modelsLoadError} />
                ) : isLoadingModels ? (
                  <InlineLoading label="Carregando modelos..." />
                ) : models && models.length > 0 ? (
                  <>
                    <select
                      className="field-shell h-10 w-full rounded-2xl px-3.5 text-sm text-foreground outline-none"
                      value={selectedModelId}
                      onChange={(e) => setSelectedModelId(Number(e.target.value) || "")}
                    >
                      <option value="">Todos os modelos</option>
                      {models.map((model) => (
                        <option key={model.modelId} value={model.modelId}>
                          {model.modelName} (estoque: {model.stock})
                        </option>
                      ))}
                    </select>
                    <p className="text-xs text-foreground-soft/70">
                      Selecione um modelo especifico ou deixe "Todos os modelos" para atualizar todos.
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-foreground-soft/70">
                    Nenhum modelo encontrado.
                  </p>
                )}
              </label>
            ) : null}

            <label className="block space-y-1.5">
              <span className="text-sm font-semibold text-foreground">Estoque alvo</span>
              <Input
                type="number"
                min={1}
                step={1}
                value={stockTarget}
                onChange={(event) => {
                  const nextValue = event.target.value;

                  if (/^\d*$/.test(nextValue)) {
                    setStockTarget(nextValue);
                  }
                }}
                inputMode="numeric"
                placeholder={String(defaultStockTarget)}
                className="h-10 px-3.5"
              />
              <p className="text-xs text-foreground-soft/70">
                Deixe em branco para usar o valor padrao ({defaultStockTarget}).
              </p>
            </label>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button type="submit" className="w-full sm:w-auto" disabled={!canSubmit}>
                {isUpdating ? <Spinner /> : <Save className="size-4" />}
                Atualizar estoque
              </Button>
            </div>
          </form>
        )}
      </CardContent>
    </Card>
  );
}