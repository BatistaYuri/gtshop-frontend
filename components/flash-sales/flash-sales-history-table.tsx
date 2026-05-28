"use client";

import { useMemo } from "react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineLoading } from "@/components/ui/inline-loading";
import { mapFlashSaleHistoryItemToRow } from "@/lib/flash-sales-history";
import { formatDateTime, formatNumber } from "@/lib/utils";
import type { FlashSaleHistoryItem, FlashSaleHistoryStatus } from "@/types/api";

function getStatusVariant(status: FlashSaleHistoryStatus) {
  if (status === "ERROR") {
    return "danger" as const;
  }

  if (status === "SKIPPED") {
    return "warning" as const;
  }

  return "success" as const;
}

export function FlashSalesHistoryTable({
  items,
  isLoading,
  error,
  page,
  total,
  limit,
  onPageChange,
}: {
  items: FlashSaleHistoryItem[];
  isLoading: boolean;
  error: string | null;
  page: number;
  total: number;
  limit: number;
  onPageChange: (page: number) => void;
}) {
  const totalPages = useMemo(() => Math.max(1, Math.ceil(total / limit)), [total, limit]);
  const rows = useMemo(() => items.map(mapFlashSaleHistoryItemToRow), [items]);

  if (isLoading) {
    return <InlineLoading label="Carregando historico de replicacao..." />;
  }

  if (error) {
    return <Alert variant="danger" message={error} />;
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        title="Nenhum registro encontrado"
        description="Nao ha historico de replicacao de oferta relampago para os filtros selecionados."
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto rounded-[28px] border border-border bg-white/72">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border">
              <th className="px-4 py-3 font-semibold text-foreground-soft">Data/Hora</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Execucao</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Flash Sale Origem</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Flash Sale Destino</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Nome</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Data Alvo</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Status</th>
              <th className="px-4 py-3 font-semibold text-foreground-soft">Erro</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-border last:border-b-0 hover:bg-black/[0.02]">
                <td className="whitespace-nowrap px-4 py-3 text-foreground-soft">{formatDateTime(row.createdAt)}</td>
                <td className="px-4 py-3">
                  <Badge variant="muted">{row.executionLabel}</Badge>
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{row.sourceFlashSaleLabel}</td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground">{row.targetFlashSaleLabel}</td>
                <td className="max-w-[220px] truncate px-4 py-3 text-foreground" title={row.flashSaleName}>
                  {row.flashSaleName}
                </td>
                <td className="whitespace-nowrap px-4 py-3 text-foreground-soft">{formatDateTime(row.targetDate)}</td>
                <td className="px-4 py-3">
                  <Badge variant={getStatusVariant(row.status)}>{row.status}</Badge>
                </td>
                <td className="max-w-[340px] truncate px-4 py-3 text-foreground-soft" title={row.errorMessage}>
                  {row.errorMessage}
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