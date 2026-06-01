"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { formatNumber } from "@/lib/utils";
import type { ReportsTimelinePoint } from "@/hooks/useReports";

const PAGE_SIZE = 15;

function TableSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-72 animate-pulse rounded-xl bg-surface-accent" />
        <div className="h-4 w-80 animate-pulse rounded-xl bg-surface-accent" />
      </CardHeader>
      <CardContent className="space-y-3 pt-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-10 animate-pulse rounded-xl bg-surface-accent" />
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportsDailyTable({ items, isLoading }: { items: ReportsTimelinePoint[]; isLoading: boolean }) {
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => [...items].sort((left, right) => right.day.localeCompare(left.day)),
    [items],
  );

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = sorted.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  if (isLoading) {
    return <TableSkeleton />;
  }

  if (sorted.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Detalhamento diario</CardTitle>
          <CardDescription>Visao detalhada por dia para Estoque e Flash Sale.</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <EmptyState
            title="Nenhum dia consolidado"
            description="Ainda nao existem dados diarios para o periodo selecionado."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Detalhamento diario</CardTitle>
        <CardDescription>Ordenado por data decrescente para leitura rapida de operacao.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-0">
        <div className="soft-scrollbar overflow-x-auto rounded-[24px] border border-border bg-white/75">
          <table className="w-full min-w-[940px] text-left text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="px-4 py-3 font-semibold text-foreground-soft">Data</th>
                <th className="px-4 py-3 font-semibold text-foreground-soft">Stock updatesSucceeded</th>
                <th className="px-4 py-3 font-semibold text-foreground-soft">Stock noOpSkipped</th>
                <th className="px-4 py-3 font-semibold text-foreground-soft">Stock errors</th>
                <th className="px-4 py-3 font-semibold text-foreground-soft">Flash createdCampaigns</th>
                <th className="px-4 py-3 font-semibold text-foreground-soft">Flash skippedCampaigns</th>
                <th className="px-4 py-3 font-semibold text-foreground-soft">Flash errors</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.day} className="border-b border-border last:border-b-0 hover:bg-black/[0.02]">
                  <td className="px-4 py-3 font-semibold text-foreground">{row.day}</td>
                  <td className="px-4 py-3 text-foreground">{formatNumber(row.stockUpdatesSucceeded)}</td>
                  <td className="px-4 py-3 text-foreground">{formatNumber(row.stockNoOpSkipped)}</td>
                  <td className="px-4 py-3 text-danger">{formatNumber(row.stockErrors)}</td>
                  <td className="px-4 py-3 text-foreground">{formatNumber(row.flashCreatedCampaigns)}</td>
                  <td className="px-4 py-3 text-foreground">{formatNumber(row.flashSkippedCampaigns)}</td>
                  <td className="px-4 py-3 text-danger">{formatNumber(row.flashErrors)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 ? (
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-foreground-soft">
              Pagina {currentPage} de {totalPages} ({formatNumber(sorted.length)} dias)
            </p>
            <div className="flex items-center gap-2">
              <Button type="button" variant="subtle" size="sm" disabled={currentPage <= 1} onClick={() => setPage((current) => Math.max(1, current - 1))}>
                Anterior
              </Button>
              <Button type="button" variant="subtle" size="sm" disabled={currentPage >= totalPages} onClick={() => setPage((current) => Math.min(totalPages, current + 1))}>
                Proxima
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
