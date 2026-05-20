import { FlashSalesCreatedCampaignsList } from "@/components/flash-sales/flash-sales-created-campaigns-list";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineLoading } from "@/components/ui/inline-loading";
import { compactMessage, formatDateTime, humanizeStatus } from "@/lib/utils";
import type { FlashSaleExecution } from "@/types/api";

function getStatusVariant(status: FlashSaleExecution["status"]) {
  if (status === "ERROR") {
    return "danger" as const;
  }

  if (status === "PARTIAL_SUCCESS" || status === "RUNNING") {
    return "warning" as const;
  }

  return "success" as const;
}

export function FlashSalesLatestExecution({
  execution,
  isLoading,
  error,
}: {
  execution: FlashSaleExecution | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Ultima atualizacao de oferta relampago</CardTitle>
          <CardDescription>Historico persistido mais recente da rotina de Oferta Relampago.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {isLoading ? (
          <InlineLoading label="Carregando ultima execucao..." />
        ) : error ? (
          <Alert variant="danger" message={error} />
        ) : !execution ? (
          <EmptyState
            title="Nenhuma execucao registrada ainda"
            description="Assim que a rotina automatica ou manual rodar, os dados da ultima execucao aparecerao aqui."
          />
        ) : (
          <>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-[28px] border border-border bg-white/72 p-5">
                <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Status</p>
                <div className="mt-3 flex items-center gap-3">
                  <h3 className="text-3xl font-semibold">{humanizeStatus(execution.status)}</h3>
                  <Badge variant={getStatusVariant(execution.status)}>{execution.status}</Badge>
                </div>
                <p className="mt-3 text-sm leading-6 text-foreground-soft">
                  {execution.errorMessage
                    ? compactMessage(execution.errorMessage, "Erro nao informado.")
                    : "Sem observacoes adicionais."}
                </p>
              </div>

              <div className="space-y-4 rounded-[28px] border border-border bg-white/72 p-5">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Campanhas criadas</p>
                  <p className="mt-2 text-3xl font-semibold">{execution.createdCampaigns}</p>
                </div>
                <div className="grid gap-3 text-sm text-foreground-soft sm:grid-cols-2">
                  <div>
                    <p className="font-semibold text-foreground">Data alvo</p>
                    <p>{execution.targetDate}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Campanhas de origem</p>
                    <p>{execution.sourceCampaigns}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Inicio</p>
                    <p>{formatDateTime(execution.startedAt || execution.createdAt)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Fim</p>
                    <p>{formatDateTime(execution.finishedAt)}</p>
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">Campanhas ignoradas</p>
                    <p>{execution.skippedCampaigns}</p>
                  </div>
                </div>
              </div>
            </div>

            <FlashSalesCreatedCampaignsList
              campaigns={execution.createdDiscounts}
              title="Descontos criados na ultima execucao"
              description="Itens persistidos no historico da ultima execucao da rotina."
              emptyMessage="Nenhum desconto foi criado na ultima execucao registrada."
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}