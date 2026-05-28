"use client";

import { Clock, Play } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineLoading } from "@/components/ui/inline-loading";
import { Spinner } from "@/components/ui/spinner";
import type { ActiveFlashSale } from "@/types/api";

function formatSaleTime(unixSeconds: number): string {
  const date = new Date(unixSeconds * 1000);
  return date.toLocaleString("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
  });
}

export function ActiveFlashSalesList({
  sales,
  isLoading,
  error,
  replicatingId,
  onReplicate,
}: {
  sales: ActiveFlashSale[] | null;
  isLoading: boolean;
  error: string | null;
  replicatingId: number | null;
  onReplicate: (flashSaleId: number) => void;
}) {
  if (isLoading) {
    return (
      <div className="rounded-[24px] border border-border bg-white/72 p-6">
        <InlineLoading label="Carregando ofertas relampago ativas..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-[24px] border border-border bg-white/72 p-6">
        <Alert variant="danger" message={error} />
      </div>
    );
  }

  if (!sales || sales.length === 0) {
    return (
      <div className="rounded-[24px] border border-border bg-white/72 p-6">
        <EmptyState
          title="Nenhuma oferta relampago ativa"
          description="No momento nao ha campanhas ativas na Shopee para exibir."
        />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sales.map((sale) => {
        const isReplicating = replicatingId === sale.flashSaleId;

        return (
          <div
            key={sale.flashSaleId}
            className="flex flex-col gap-3 rounded-[24px] border border-border bg-white/72 p-5 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="min-w-0 space-y-1.5">
              <h3 className="truncate text-base font-semibold text-foreground">
                {sale.flashSaleName}
              </h3>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-foreground-soft">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="size-3.5 shrink-0" />
                  {formatSaleTime(sale.startTime)} &ndash; {formatSaleTime(sale.endTime)}
                </span>
                {sale.status !== undefined && (
                  <Badge variant="muted" className="text-xs">
                    Status: {sale.status}
                  </Badge>
                )}
              </div>
            </div>

            <Button
              type="button"
              className="shrink-0"
              onClick={() => onReplicate(sale.flashSaleId)}
              disabled={isReplicating}
            >
              {isReplicating ? <Spinner /> : <Play className="size-4" />}
              {isReplicating ? "Replicando..." : "Agendar para amanhã"}
            </Button>
          </div>
        );
      })}
    </div>
  );
}