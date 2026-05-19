"use client";

import { Play } from "lucide-react";
import { FlashSaleAutomationSection } from "@/components/flash-sales/flash-sale-automation-section";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useReplicateFlashSales } from "@/hooks/useReplicateFlashSales";
import { useSettings } from "@/hooks/useSettings";

export default function FlashSalesPage() {
  const {
    data,
    isLoading,
    isUpdatingFlashSaleAutomation,
    loadError,
    feedback,
    saveFlashSaleAutomation,
  } = useSettings();
  const { runReplication, isRunning, feedback: runFeedback } = useReplicateFlashSales();

  return (
    <div className="space-y-6">
      {feedback ? <Alert variant={feedback.type === "success" ? "success" : "danger"} message={feedback.message} /> : null}
      {runFeedback ? <Alert variant={runFeedback.type === "error" ? "danger" : runFeedback.type} message={runFeedback.message} /> : null}

      {isLoading ? (
        <div className="flex items-center gap-3 rounded-2xl bg-white/72 px-4 py-5 text-sm text-foreground-soft">
          <Spinner /> Carregando configuracoes da automacao...
        </div>
      ) : loadError ? (
        <Alert variant="danger" message={loadError} />
      ) : data ? (
        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Oferta Relampago</CardTitle>
              <CardDescription>Configure a automacao diaria de oferta relampago.</CardDescription>
            </div>
            <Button type="button" className="w-full md:w-auto md:self-start" onClick={() => void runReplication()} disabled={isRunning}>
              {isRunning ? <Spinner /> : <Play className="size-4" />}
              Atualizar oferta relampago
            </Button>
          </CardHeader>
          <CardContent className="pt-0 pb-5">
            <FlashSaleAutomationSection
              key={`${data.companyName}-${data.flashSaleAutomationEnabled}`}
              enabled={data.flashSaleAutomationEnabled}
              isSaving={isUpdatingFlashSaleAutomation}
              onSave={(enabled) => saveFlashSaleAutomation({ enabled })}
            />
          </CardContent>
        </Card>
      ) : (
        <Alert variant="warning" message="A API nao retornou configuracoes da automacao para exibicao." />
      )}
    </div>
  );
}