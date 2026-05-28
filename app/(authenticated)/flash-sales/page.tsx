"use client";

import Link from "next/link";
import { useState } from "react";
import { ActiveFlashSalesList } from "@/components/flash-sales/active-flash-sales-list";
import { FlashSaleAutomationSection } from "@/components/flash-sales/flash-sale-automation-section";
import { ReplicationResultCard } from "@/components/flash-sales/replication-result-card";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { InlineLoading } from "@/components/ui/inline-loading";
import { useActiveFlashSales } from "@/hooks/useActiveFlashSales";
import { useReplicateFlashSale } from "@/hooks/useReplicateFlashSale";
import { useSettings } from "@/hooks/useSettings";
import { ROUTES } from "@/lib/constants";

export default function FlashSalesPage() {
  const {
    data,
    isLoading,
    isUpdatingFlashSaleAutomation,
    loadError,
    feedback,
    saveFlashSaleAutomation,
  } = useSettings();
  const {
    data: activeSales,
    isLoading: isActiveSalesLoading,
    error: activeSalesError,
  } = useActiveFlashSales();
  const {
    feedback: replicateFeedback,
    result: replicateResult,
    runReplication: runSingleReplication,
  } = useReplicateFlashSale();

  const [replicatingId, setReplicatingId] = useState<number | null>(null);

  async function handleReplicate(flashSaleId: number) {
    setReplicatingId(flashSaleId);
    try {
      await runSingleReplication(flashSaleId);
    } finally {
      setReplicatingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {/* Automation settings */}
      <FeedbackAlert feedback={feedback} />
      <FeedbackAlert feedback={replicateFeedback} />

      {isLoading ? (
        <InlineLoading label="Carregando configuracoes da automacao..." />
      ) : loadError ? (
        <Alert variant="danger" message={loadError} />
      ) : data ? (
        <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Oferta Relampago</CardTitle>
              <CardDescription>Configure a automacao diaria de oferta relampago.</CardDescription>
            </div>
            <Button asChild type="button" variant="subtle" className="w-full md:w-auto md:self-start">
              <Link href={ROUTES.flashSalesHistory}>Ver historico</Link>
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

      {/* Active flash sales */}
      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Campanhas ativas</CardTitle>
            <CardDescription>
              Selecione uma oferta relampago ativa para replica-la para amanha.
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <ActiveFlashSalesList
            sales={activeSales}
            isLoading={isActiveSalesLoading}
            error={activeSalesError}
            replicatingId={replicatingId}
            onReplicate={handleReplicate}
          />
        </CardContent>
      </Card>

      {/* Replication result */}
      {replicateResult && (
        <ReplicationResultCard result={replicateResult} />
      )}
    </div>
  );
}
