"use client";

import { RefreshCw } from "lucide-react";
import { ReportsDailyTable } from "@/components/reports/reports-daily-table";
import { ReportsOverviewCards } from "@/components/reports/reports-overview-cards";
import { ReportsTimelineChart } from "@/components/reports/reports-timeline-chart";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useReports } from "@/hooks/useReports";
import type { ReportsPeriodDays } from "@/types/api";

const PERIOD_OPTIONS: Array<{ value: ReportsPeriodDays; label: string }> = [
  { value: 7, label: "7 dias" },
  { value: 30, label: "30 dias" },
  { value: 90, label: "90 dias" },
];

export default function ReportsPage() {
  const {
    days,
    setDays,
    overview,
    timeline,
    isLoading,
    isRefreshing,
    error,
    refresh,
  } = useReports(30);

  const periodLabel = PERIOD_OPTIONS.find((option) => option.value === days)?.label ?? `${days} dias`;
  const isBusy = isLoading || isRefreshing;
  const hasNoData = !isLoading && timeline.length === 0 && !overview;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-3xl">Relatorios</CardTitle>
            <CardDescription>
              Visao executiva das automacoes de Estoque e Flash Sale nos ultimos {periodLabel.toLowerCase()}.
            </CardDescription>
          </div>

          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-end lg:w-auto">
            <div className="inline-flex rounded-2xl border border-border bg-white/72 p-1">
              {PERIOD_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  size="sm"
                  variant={option.value === days ? "primary" : "subtle"}
                  className="rounded-xl"
                  onClick={() => setDays(option.value)}
                  disabled={isBusy && option.value === days}
                >
                  {option.label}
                </Button>
              ))}
            </div>

            <Button type="button" variant="subtle" onClick={() => void refresh()} disabled={isBusy}>
              {isBusy ? <Spinner /> : <RefreshCw className="size-4" />}
              Atualizar
            </Button>
          </div>
        </CardHeader>
        {isRefreshing ? (
          <CardContent className="pt-0">
            <p className="text-sm text-foreground-soft">Atualizando dados do periodo selecionado...</p>
          </CardContent>
        ) : null}
      </Card>

      {error ? (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <Alert variant="danger" message={error} />
            <div>
              <Button type="button" variant="subtle" onClick={() => void refresh()}>
                Tentar novamente
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      {hasNoData ? (
        <EmptyState
          title="Sem dados operacionais"
          description="Nenhum dado foi retornado para o periodo selecionado. Tente outro periodo ou atualize novamente em alguns instantes."
          action={(
            <Button type="button" onClick={() => void refresh()}>
              Atualizar relatorios
            </Button>
          )}
        />
      ) : (
        <>
          <ReportsOverviewCards overview={overview} isLoading={isLoading} />

          <div className="grid gap-6 xl:grid-cols-2">
            <ReportsTimelineChart
              title="Estoque por dia"
              description="Tendencia diaria de atualizacoes com sucesso, no-op e erros."
              items={timeline}
              series={[
                { key: "stockUpdatesSucceeded", label: "updatesSucceeded", color: "#1f7a56" },
                { key: "stockNoOpSkipped", label: "noOpSkipped", color: "#dd8f46" },
                { key: "stockErrors", label: "errors", color: "#a13d32" },
              ]}
              isLoading={isLoading}
            />

            <ReportsTimelineChart
              title="Flash Sale por dia"
              description="Tendencia diaria de campanhas criadas, puladas e erros."
              items={timeline}
              series={[
                { key: "flashCreatedCampaigns", label: "createdCampaigns", color: "#0e5f6d" },
                { key: "flashSkippedCampaigns", label: "skippedCampaigns", color: "#dd8f46" },
                { key: "flashErrors", label: "errors", color: "#a13d32" },
              ]}
              isLoading={isLoading}
            />
          </div>

          <ReportsDailyTable items={timeline} isLoading={isLoading} />
        </>
      )}
    </div>
  );
}
