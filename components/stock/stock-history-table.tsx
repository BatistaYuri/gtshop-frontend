"use client";

import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineLoading } from "@/components/ui/inline-loading";
import { formatDateTime, formatNumber } from "@/lib/utils";
import type { StockUpdateHistoryItem } from "@/types/api";

function StockChangeBadge({ value }: { value: number }) {
  if (value > 0) {
    return (
      <span className="font-semibold text-success">
        +{formatNumber(value)}
      </span>
    );
  }

  if (value < 0) {
    return (
      <span className="font-semibold text-danger">
        {formatNumber(value)}
      </span>
    );
  }

  return <span className="font-semibold text-foreground-soft">{formatNumber(value)}</span>;
}

export function StockHistoryTable({
  items,
  isLoading,
  page,
  total,
  limit,
  onPageChange,
}: {
  items: StockUpdateHistoryItem[];
  isLoading: boolean;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);

  if (isLoading) {
    return <InlineLoading label="Carregando historico de atualizacao..." />;
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="Nenhum registro encontrado"
        description="Nao ha historico de atualizacao de estoque para os filtros selecionados."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[28px] border border-border bg-white/72">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-semibold text-foreground-soft">Produto</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Estoque anterior</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Estoque atualizado</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Diferenca</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Data</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Execucao</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} className="border-b border-border last:border-b-0 hover:bg-black/[0.02]">
                <td className="px-4 py-3">
                  <div className="space-y-0.5">
                    <p className="font-medium text-foreground">{item.productName}</p>
                    {item.modelName ? (
                      <p className="text-xs text-foreground-soft">{item.modelName}</p>
                    ) : null}
                  </div>
                </td>
                <td className="px-4 py-3 text-foreground">{formatNumber(item.stockBefore)}</td>
                <td className="px-4 py-3 text-foreground">{formatNumber(item.stockAfter)}</td>
                <td className="px-4 py-3">
                  <StockChangeBadge value={item.stockChange} />
                </td>
                <td className="px-4 py-3 text-foreground-soft">{formatDateTime(item.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge variant="muted">#{item.executionId}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <p className="text-sm text-foreground-soft">
            Mostrando pagina {page} de {totalPages} ({formatNumber(total)} registros)
          </p>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="subtle"
              size="sm"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              Anterior
            </Button>
            <Button
              type="button"
              variant="subtle"
              size="sm"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Proxima
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
}