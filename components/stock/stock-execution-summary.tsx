import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { InlineLoading } from "@/components/ui/inline-loading";
import { compactMessage, formatDateTime, getJobUpdatedCount, humanizeStatus } from "@/lib/utils";
import type { LatestJobExecutionResponse } from "@/types/api";

function getStatusVariant(status: string | undefined) {
  if (status === "ERROR" || status === "FAILURE") {
    return "danger" as const;
  }

  if (status === "PARTIAL_SUCCESS" || status === "RUNNING" || status === "PENDING") {
    return "warning" as const;
  }

  return "success" as const;
}

export function StockExecutionSummary({
  execution,
  isLoading,
  error,
}: {
  execution: LatestJobExecutionResponse | null;
  isLoading: boolean;
  error: string | null;
}) {
  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-2xl">Ultima execucao de estoque</CardTitle>
          <CardDescription>Resumo da ultima execucao da rotina de atualizacao de estoque.</CardDescription>
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-[28px] border border-border bg-white/72 p-5">
              <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Status</p>
              <div className="mt-3 flex items-center gap-3">
                <h3 className="text-3xl font-semibold">{humanizeStatus(execution.status || execution.result)}</h3>
                <Badge variant={getStatusVariant(execution.status || execution.result)}>
                  {execution.status || execution.result || "N/A"}
                </Badge>
              </div>
              <p className="mt-3 text-sm leading-6 text-foreground-soft">
                {execution.error
                  ? compactMessage(execution.error, "Erro nao informado.")
                  : execution.message
                    ? compactMessage(execution.message)
                    : "Sem observacoes adicionais."}
              </p>
            </div>

            <div className="space-y-4 rounded-[28px] border border-border bg-white/72 p-5">
              <div>
                <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Produtos atualizados</p>
                <p className="mt-2 text-3xl font-semibold">{getJobUpdatedCount(execution) ?? "-"}</p>
              </div>
              <div className="grid gap-3 text-sm text-foreground-soft sm:grid-cols-2">
                <div>
                  <p className="font-semibold text-foreground">Inicio</p>
                  <p>{formatDateTime(execution.startedAt || execution.createdAt)}</p>
                </div>
                <div>
                  <p className="font-semibold text-foreground">Fim</p>
                  <p>{formatDateTime(execution.finishedAt)}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}