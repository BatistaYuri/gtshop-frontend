"use client";

import { Zap } from "lucide-react";
import { FlashSalesCreatedCampaignsList } from "@/components/flash-sales/flash-sales-created-campaigns-list";
import { FlashSalesErrorsList } from "@/components/flash-sales/flash-sales-errors-list";
import { FlashSalesExecutionSummary } from "@/components/flash-sales/flash-sales-execution-summary";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useReplicateFlashSales } from "@/hooks/useReplicateFlashSales";

export function FlashSalesCard() {
  const { feedback, isRunning, result, runReplication } = useReplicateFlashSales();

  return (
    <Card>
      <CardHeader className="space-y-4">
        <div className="space-y-2">
          <CardTitle className="text-2xl">Oferta Relampago</CardTitle>
          <CardDescription>Replica para amanha as ofertas relampago que estao em andamento hoje.</CardDescription>
        </div>

        <Alert
          variant="info"
          title="Rotina automatica"
          message="A rotina automatica roda a meia-noite no horario de Brasilia."
        />
      </CardHeader>

      <CardContent className="space-y-6">
        {feedback ? <Alert variant={feedback.type === "error" ? "danger" : feedback.type} message={feedback.message} /> : null}

        <div className="flex flex-col gap-3 rounded-[24px] border border-border bg-white/72 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <p className="text-lg font-semibold text-foreground">Replicacao manual</p>
            <p className="text-sm leading-6 text-foreground-soft">
              Use esta acao quando precisar garantir a preparacao das ofertas de amanha sem esperar a rotina automatica.
            </p>
          </div>

          <Button type="button" onClick={() => void runReplication()} disabled={isRunning} className="lg:self-start">
            {isRunning ? <Spinner /> : <Zap className="size-4" />}
            Replicar ofertas para amanha
          </Button>
        </div>

        {isRunning ? (
          <div className="flex items-center gap-3 rounded-2xl bg-white/72 px-4 py-5 text-sm text-foreground-soft">
            <Spinner /> Executando replicacao das ofertas relampago...
          </div>
        ) : null}

        {result ? (
          <div className="space-y-6">
            <FlashSalesExecutionSummary result={result} />
            <FlashSalesCreatedCampaignsList campaigns={result.created} />
            <FlashSalesErrorsList errors={result.errors} />
          </div>
        ) : (
          <div className="rounded-[24px] border border-dashed border-border bg-white/70 px-5 py-6 text-sm leading-6 text-foreground-soft">
            Nenhuma execucao manual foi realizada nesta sessao. Quando voce disparar a replicacao, o resumo aparecera aqui.
          </div>
        )}
      </CardContent>
    </Card>
  );
}