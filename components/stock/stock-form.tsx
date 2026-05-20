"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { BooleanToggleField } from "@/components/ui/boolean-toggle-field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { parseNumberList } from "@/lib/utils";
import type { SettingsResponse } from "@/types/api";

const STOCK_STATUS_OPTIONS = {
  all: ["NORMAL", "UNLIST"],
  active: ["NORMAL"],
  inactive: ["UNLIST"],
} as const;

function getStatusOptionValue(statuses: string[]) {
  const normalizedStatuses = [...statuses].sort().join(",");

  if (normalizedStatuses === [...STOCK_STATUS_OPTIONS.all].sort().join(",")) {
    return "all";
  }

  if (normalizedStatuses === [...STOCK_STATUS_OPTIONS.inactive].sort().join(",")) {
    return "inactive";
  }

  return "active";
}

export function StockForm({
  settings,
  isSaving,
  onSave,
}: {
  settings: SettingsResponse;
  isSaving: boolean;
  onSave: (payload: {
    enabled: boolean;
    productIds: number[];
    statuses: string[];
    stockTarget: number;
  }) => Promise<unknown>;
}) {
  const [enabled, setEnabled] = useState(settings.stockAutomationEnabled);
  const [productIds] = useState(settings.stockAutomationProductIds.join(", "));
  const [statusOption, setStatusOption] = useState(getStatusOptionValue(settings.stockAutomationStatuses));
  const [stockTarget, setStockTarget] = useState(String(settings.stockAutomationStockTarget));
  const [validationError, setValidationError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const parsedProductIds = parseNumberList(productIds);
    const parsedStatuses = STOCK_STATUS_OPTIONS[statusOption as keyof typeof STOCK_STATUS_OPTIONS];
    const parsedStockTarget = Number(stockTarget);

    if (!Number.isFinite(parsedStockTarget) || parsedStockTarget <= 0) {
      setValidationError("Informe um estoque alvo numerico valido e maior que zero.");
      return;
    }

    setValidationError(null);
    await onSave({
      enabled,
      productIds: parsedProductIds,
      statuses: [...parsedStatuses],
      stockTarget: parsedStockTarget,
    });
  }

  return (
    <form className="max-w-2xl space-y-4" onSubmit={handleSubmit}>
      <BooleanToggleField
        name="stock-automation-enabled"
        label="Atualizar o estoque todos os dias"
        value={enabled}
        disabled={isSaving}
        onChange={setEnabled}
      />

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Produtos que serao atualizados</span>
        <select
          value={statusOption}
          onChange={(event) => setStatusOption(event.target.value)}
          className="field-shell h-10 w-full rounded-2xl px-3.5 text-sm text-foreground outline-none"
        >
          <option value="all">Todos</option>
          <option value="active">Ativos</option>
          <option value="inactive">Inativos</option>
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Quantidade</span>
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
          placeholder="10000"
          className="h-10 px-3.5"
        />
      </label>

      {validationError ? <Alert variant="warning" message={validationError} /> : null}

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button type="submit" className="w-full sm:w-auto" disabled={isSaving}>
          {isSaving ? <Spinner /> : <Save className="size-4" />}
          Salvar configuracoes
        </Button>
      </div>
    </form>
  );
}