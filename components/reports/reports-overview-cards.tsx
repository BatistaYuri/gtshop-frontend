import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, formatNumber } from "@/lib/utils";
import type { ReportsOverviewResponse } from "@/types/api";

function toSafeNumber(value: number | undefined) {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Number(value);
}

function formatMs(value: number | undefined) {
  return `${formatNumber(toSafeNumber(value))} ms`;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border py-2.5 last:border-b-0">
      <span className="text-sm text-foreground-soft">{label}</span>
      <span className="text-sm font-semibold text-foreground">{value}</span>
    </div>
  );
}

function OverviewCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <div className="h-6 w-40 animate-pulse rounded-xl bg-surface-accent" />
        <div className="h-4 w-56 animate-pulse rounded-xl bg-surface-accent" />
      </CardHeader>
      <CardContent className="space-y-2 pt-0">
        {Array.from({ length: 10 }).map((_, index) => (
          <div key={index} className="h-9 animate-pulse rounded-xl bg-surface-accent" />
        ))}
      </CardContent>
    </Card>
  );
}

export function ReportsOverviewCards({
  overview,
  isLoading,
}: {
  overview: ReportsOverviewResponse | null;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="grid gap-6 xl:grid-cols-2">
        <OverviewCardSkeleton />
        <OverviewCardSkeleton />
      </div>
    );
  }

  const stock = overview?.stock;
  const flash = overview?.flashSale;

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Estoque</CardTitle>
          <CardDescription>
            Ultima execucao: {formatDateTime(stock?.latestExecutionAt ?? null)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 pt-0">
          <MetricRow label="Execucoes (total | sucesso | parcial | erro)" value={`${formatNumber(toSafeNumber(stock?.executions?.total))} | ${formatNumber(toSafeNumber(stock?.executions?.success))} | ${formatNumber(toSafeNumber(stock?.executions?.partialSuccess))} | ${formatNumber(toSafeNumber(stock?.executions?.error))}`} />
          <MetricRow label="Atualizacoes enviadas" value={formatNumber(toSafeNumber(stock?.counters?.updatesSent))} />
          <MetricRow label="Atualizacoes com sucesso" value={formatNumber(toSafeNumber(stock?.counters?.updatesSucceeded))} />
          <MetricRow label="Itens pulados por no-op" value={formatNumber(toSafeNumber(stock?.counters?.noOpSkipped))} />
          <MetricRow label="Erros" value={formatNumber(toSafeNumber(stock?.counters?.errors))} />
          <MetricRow label="Latencia media total" value={formatMs(stock?.durationsMs?.avgTotal)} />
          <MetricRow label="P95 total" value={formatMs(stock?.durationsMs?.p95Total)} />
          <MetricRow label="Maximo total" value={formatMs(stock?.durationsMs?.maxTotal)} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Flash Sale</CardTitle>
          <CardDescription>
            Ultima execucao: {formatDateTime(flash?.latestExecutionAt ?? null)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-1 pt-0">
          <MetricRow label="Execucoes (total | sucesso | parcial | erro)" value={`${formatNumber(toSafeNumber(flash?.executions?.total))} | ${formatNumber(toSafeNumber(flash?.executions?.success))} | ${formatNumber(toSafeNumber(flash?.executions?.partialSuccess))} | ${formatNumber(toSafeNumber(flash?.executions?.error))}`} />
          <MetricRow label="Campanhas origem" value={formatNumber(toSafeNumber(flash?.counters?.sourceCampaigns))} />
          <MetricRow label="Campanhas criadas" value={formatNumber(toSafeNumber(flash?.counters?.createdCampaigns))} />
          <MetricRow label="Campanhas puladas" value={formatNumber(toSafeNumber(flash?.counters?.skippedCampaigns))} />
          <MetricRow label="Puladas por duplicidade" value={formatNumber(toSafeNumber(flash?.counters?.skippedBecauseDuplicate))} />
          <MetricRow label="Puladas por sem itens" value={formatNumber(toSafeNumber(flash?.counters?.skippedBecauseNoItems))} />
          <MetricRow label="Erros" value={formatNumber(toSafeNumber(flash?.counters?.errors))} />
          <MetricRow label="Network retries" value={formatNumber(toSafeNumber(flash?.retries?.networkRetries))} />
          <MetricRow label="Latencia media total" value={formatMs(flash?.durationsMs?.avgTotal)} />
          <MetricRow label="P95 total" value={formatMs(flash?.durationsMs?.p95Total)} />
          <MetricRow label="Maximo total" value={formatMs(flash?.durationsMs?.maxTotal)} />
        </CardContent>
      </Card>
    </div>
  );
}
