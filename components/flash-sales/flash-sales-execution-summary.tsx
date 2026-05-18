import { Badge } from "@/components/ui/badge";
import type { FlashSaleReplicationResponse } from "@/types/api";

function SummaryMetric({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-border bg-white/72 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function FlashSalesExecutionSummary({ result }: { result: FlashSaleReplicationResponse }) {
  const badgeVariant = result.createdCampaigns > 0 ? "success" : result.errors.length > 0 ? "warning" : "muted";
  const badgeLabel = result.createdCampaigns > 0 ? "Campanhas criadas" : result.skipped ? "Sem novas campanhas" : "Processado";

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between gap-3 rounded-[24px] border border-border bg-white/72 p-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft">Resultado da execucao</p>
          <p className="mt-1 text-sm leading-6 text-foreground-soft">Resumo do retorno recebido do backend para a replicacao manual.</p>
        </div>
        <Badge variant={badgeVariant}>{badgeLabel}</Badge>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <SummaryMetric label="Data alvo" value={result.targetDate} />
        <SummaryMetric label="Campanhas de origem" value={result.sourceCampaigns} />
        <SummaryMetric label="Campanhas criadas" value={result.createdCampaigns} />
        <SummaryMetric label="Campanhas ignoradas" value={result.skippedCampaigns} />
      </div>
    </section>
  );
}