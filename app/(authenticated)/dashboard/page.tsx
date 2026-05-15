"use client";

import { Bolt } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Spinner } from "@/components/ui/spinner";
import { useLatestExecution } from "@/hooks/useLatestExecution";
import { useRunStockUpdate } from "@/hooks/useRunStockUpdate";
import { compactMessage, formatDateTime, formatNumber, getJobUpdatedCount, humanizeStatus } from "@/lib/utils";

export default function DashboardPage() {
  const { data: latestExecution, isLoading: isExecutionLoading, error: executionError, refresh } = useLatestExecution();
  const { runNow, isRunning, feedback } = useRunStockUpdate({ onCompleted: refresh });

  const updatedCount = getJobUpdatedCount(latestExecution || undefined);
  const latestStatus = humanizeStatus(latestExecution?.status || latestExecution?.result);

  return (
    <div className="space-y-6">
      <section>
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Ultima atualizacao de estoque</CardTitle>
              <CardDescription>Resultado mais recente da rotina de atualizacao de estoque.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {feedback ? (
              <Alert
                variant={feedback.type === "error" ? "danger" : feedback.type}
                message={feedback.message}
              />
            ) : null}

            {isExecutionLoading ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white/70 px-4 py-5 text-sm text-foreground-soft">
                <Spinner /> Carregando ultima execucao...
              </div>
            ) : executionError ? (
              <Alert variant="danger" message={executionError} />
            ) : !latestExecution ? (
              <EmptyState
                title="Nenhuma execucao anterior"
                description="Assim que a rotina rodar pela primeira vez, os dados da execucao mais recente aparecerao aqui."
                action={
                  <Button onClick={() => void runNow()} disabled={isRunning}>
                    {isRunning ? <Spinner /> : <Bolt className="size-4" />}
                    Executar primeira rotina
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-[28px] border border-border bg-white/72 p-5">
                  <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Status</p>
                  <div className="mt-3 flex items-center gap-3">
                    <h3 className="text-3xl font-semibold">{latestStatus}</h3>
                    <Badge
                      variant={
                        (latestExecution.partialFailure || latestStatus.toLowerCase().includes("partial"))
                          ? "warning"
                          : latestStatus.toLowerCase().includes("fail") || latestExecution.error
                            ? "danger"
                            : "success"
                      }
                    >
                      {latestExecution.partialFailure ? "Parcial" : latestExecution.status || latestExecution.result || "Finalizado"}
                    </Badge>
                  </div>
                  <p className="mt-3 text-sm leading-6 text-foreground-soft">
                    {latestExecution.error
                      ? compactMessage(latestExecution.error, "Erro nao informado.")
                      : compactMessage(latestExecution.message, "Sem observacoes adicionais.")}
                  </p>
                </div>

                <div className="space-y-4 rounded-[28px] border border-border bg-white/72 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Produtos atualizados</p>
                    <p className="mt-2 text-3xl font-semibold">{formatNumber(updatedCount)}</p>
                  </div>
                  <div className="grid gap-3 text-sm text-foreground-soft sm:grid-cols-2">
                    <div>
                      <p className="font-semibold text-foreground">Inicio</p>
                      <p>{formatDateTime(latestExecution.startedAt || latestExecution.createdAt)}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">Fim</p>
                      <p>{formatDateTime(latestExecution.finishedAt || latestExecution.updatedAt)}</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}