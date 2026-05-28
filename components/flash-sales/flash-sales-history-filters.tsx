"use client";

import { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { FlashSaleHistoryFiltersState } from "@/lib/flash-sales-history";
import { formatDateTime } from "@/lib/utils";
import type { FlashSaleExecutionSummary } from "@/types/api";

export function FlashSalesHistoryFilters({
  executions,
  filters,
  onFilterChange,
  onClearFilters,
}: {
  executions: FlashSaleExecutionSummary[];
  filters: FlashSaleHistoryFiltersState;
  onFilterChange: (filters: FlashSaleHistoryFiltersState) => void;
  onClearFilters: () => void;
}) {
  const updateField = useCallback(
    (field: keyof FlashSaleHistoryFiltersState, value: string | number | undefined) => {
      onFilterChange({ ...filters, [field]: value });
    },
    [filters, onFilterChange],
  );

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <label className="block space-y-1.5 xl:col-span-2">
        <span className="text-sm font-semibold text-foreground">Buscar oferta</span>
        <Input
          type="text"
          value={filters.search}
          onChange={(event) => updateField("search", event.target.value)}
          placeholder="Nome da flash sale ou ID de origem..."
          className="h-10 px-3.5"
        />
      </label>

      <label className="block space-y-1.5">
        <span className="text-sm font-semibold text-foreground">Status</span>
        <select
          value={filters.status}
          onChange={(event) => updateField("status", event.target.value)}
          className="field-shell h-10 w-full rounded-2xl px-3.5 text-sm text-foreground outline-none"
        >
          <option value="">Todos</option>
          <option value="SUCCESS">SUCCESS</option>
          <option value="ERROR">ERROR</option>
          <option value="SKIPPED">SKIPPED</option>
        </select>
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

      <label className="block space-y-1.5 sm:col-span-2 xl:col-span-4">
        <span className="text-sm font-semibold text-foreground">Execucao</span>
        <select
          value={filters.executionId ?? ""}
          onChange={(event) =>
            updateField("executionId", event.target.value ? Number(event.target.value) : undefined)
          }
          className="field-shell h-10 w-full rounded-2xl px-3.5 text-sm text-foreground outline-none"
        >
          <option value="">Todas as execucoes</option>
          {executions.map((execution) => (
            <option key={execution.id} value={execution.id}>
              #{execution.id} - {execution.status} ({formatDateTime(execution.startedAt)})
            </option>
          ))}
        </select>
      </label>

      <div className="sm:col-span-2 xl:col-span-1 xl:self-end">
        <Button type="button" variant="subtle" className="h-10 w-full" onClick={onClearFilters}>
          Limpar filtros
        </Button>
      </div>
    </div>
  );
}