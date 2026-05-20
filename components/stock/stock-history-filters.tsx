"use client";

import { useCallback } from "react";
import { Input } from "@/components/ui/input";
import { formatDateTime } from "@/lib/utils";
import type { ExecutionSummary } from "@/types/api";

export interface StockHistoryFiltersState {
  executionId: number | undefined;
  search: string;
  dateFrom: string;
  dateTo: string;
  stockChange: string;
}

export function StockHistoryFilters({
  executions,
  filters,
  onFilterChange,
}: {
  executions: ExecutionSummary[];
  filters: StockHistoryFiltersState;
  onFilterChange: (filters: StockHistoryFiltersState) => void;
}) {
  const updateField = useCallback(
    (field: keyof StockHistoryFiltersState, value: string | number | undefined) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Execucao</span>
        <select
          value={filters.executionId ?? ""}
          onChange={(event) =>
            updateField("executionId", event.target.value ? Number(event.target.value) : undefined)
          }
          className="field-shell h-10 w-full rounded-2xl px-3.5 text-sm text-foreground outline-none"
        >
          <option value="">Todas as execucoes</option>
          {executions.map((exec) => (
            <option key={exec.id} value={exec.id}>
              #{exec.id} — {exec.status} ({formatDateTime(exec.startedAt)})
            </option>
          ))}
        </select>
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Buscar produto</span>
        <Input
          type="text"
          value={filters.search}
          onChange={(event) => updateField("search", event.target.value)}
          placeholder="Nome do produto ou ID..."
          className="h-10 px-3.5"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Data inicio</span>
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={(event) => updateField("dateFrom", event.target.value)}
          className="h-10 px-3.5"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Data fim</span>
        <Input
          type="date"
          value={filters.dateTo}
          onChange={(event) => updateField("dateTo", event.target.value)}
          className="h-10 px-3.5"
        />
      </label>

      <label className="block space-y-1.5 sm:col-span-2 lg:col-span-4">
        <span className="text-sm font-semibold text-foreground">Variacao de estoque</span>
        <select
          value={filters.stockChange}
          onChange={(event) => updateField("stockChange", event.target.value)}
          className="field-shell h-10 w-full max-w-xs rounded-2xl px-3.5 text-sm text-foreground outline-none"
        >
          <option value="">Todas as variacoes</option>
          <option value="positive">Aumento (+)</option>
          <option value="negative">Reducao (-)</option>
        </select>
      </label>
    </div>
  );
}