"use client";

import { CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FlashSalesErrorsList } from "@/components/flash-sales/flash-sales-errors-list";
import type { ReplicationExecutionResult, ReplicationResult } from "@/types/api";

function getStatusVariant(status: ReplicationExecutionResult["status"]) {
  if (status === "ERROR") return "danger" as const;
  if (status === "PARTIAL_SUCCESS") return "warning" as const;
  return "success" as const;
}

function getStatusIcon(status: ReplicationExecutionResult["status"]) {
  if (status === "ERROR") return <XCircle className="size-5" />;
  if (status === "PARTIAL_SUCCESS") return <AlertTriangle className="size-5" />;
  return <CheckCircle2 className="size-5" />;
}

function StatusBadge({ status }: { status: ReplicationExecutionResult["status"] }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-medium">
      {getStatusIcon(status)}
      <Badge variant={getStatusVariant(status)}>{status}</Badge>
    </span>
  );
}

function MetricBox({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-[24px] border border-border bg-white/72 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-foreground-soft">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export function ReplicationResultCard({ result }: { result: ReplicationResult }) {
  if (result.skipped) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <AlertTriangle className="size-5 text-warning" />
            <div>
              <CardTitle className="text-xl">Replicacao ignorada</CardTitle>
              <CardDescription>
                {result.reason || "Nenhum motivo especificado pelo servidor."}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="space-y-2">
          <CardTitle className="text-xl">Resultado da replicacao</CardTitle>
          <CardDescription>Detalhes da operacao de agendamento para amanha.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status row */}
        {result.execution && (
          <div className="flex items-center justify-between rounded-[24px] border border-border bg-white/72 p-4">
            <span className="text-sm font-medium text-foreground-soft">Status da execucao</span>
            <StatusBadge status={result.execution.status} />
          </div>
        )}

        {/* Metrics */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <MetricBox label="Data alvo" value={result.targetDate} />
          <MetricBox label="Campanhas criadas" value={result.createdCampaigns} />
          {result.execution && (
            <MetricBox label="Erros" value={result.execution.errorsCount} />
          )}
        </div>

        {/* Error message from execution */}
        {result.execution?.errorMessage && (
          <div className="rounded-[24px] border border-danger/24 bg-danger/10 p-4 text-sm leading-6 text-foreground-soft">
            <p className="font-semibold text-danger">Mensagem de erro</p>
            <p className="mt-1">{result.execution.errorMessage}</p>
          </div>
        )}

        {/* Errors list from top-level errors[] */}
        <FlashSalesErrorsList errors={result.errors} />
      </CardContent>
    </Card>
  );
}