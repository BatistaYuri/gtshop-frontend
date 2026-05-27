"use client";

import { useCallback, useMemo, useState } from "react";
import { Play } from "lucide-react";
import { SingleStockUpdate } from "@/components/stock/single-stock-update";
import { StockExecutionSummary } from "@/components/stock/stock-execution-summary";
import { StockHistoryFilters, type StockHistoryFiltersState } from "@/components/stock/stock-history-filters";
import { StockHistoryTable } from "@/components/stock/stock-history-table";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FeedbackAlert } from "@/components/ui/feedback-alert";
import { InlineLoading } from "@/components/ui/inline-loading";
import { Spinner } from "@/components/ui/spinner";
import { StockForm } from "@/components/stock/stock-form";
import { useExecutionsList } from "@/hooks/useExecutionsList";
import { useLatestExecution } from "@/hooks/useLatestExecution";
import { useRunStockUpdate } from "@/hooks/useRunStockUpdate";
import { useSettings } from "@/hooks/useSettings";
import { useStockUpdateHistory } from "@/hooks/useStockUpdateHistory";

const DEFAULT_FILTERS: StockHistoryFiltersState = {
  executionId: undefined,
  search: "",
  dateFrom: "",
  dateTo: "",
  stockChange: "",
};

export default function StockPage() {
  const {
    data,
    isLoading,
    isSaving,
    loadError,
    feedback,
    save,
  } = useSettings();
  const { runNow, isRunning, feedback: runFeedback } = useRunStockUpdate();
  const {
    data: latestExecution,
    isLoading: isLatestExecutionLoading,
    error: latestExecutionError,
    refresh: refreshLatestExecution,
  } = useLatestExecution();
  const {
    data: executions,
    isLoading: isExecutionsLoading,
    error: executionsError,
    refresh: refreshExecutions,
  } = useExecutionsList();

  const [filters, setFilters] = useState<StockHistoryFiltersState>(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);

  const handleFilterChange = useCallback((newFilters: StockHistoryFiltersState) => {
    setFilters(newFilters);
    setPage(1);
  }, []);

  const historyParams = useMemo(
    () => ({
      page,
      limit: 50,
      executionId: filters.executionId,
      search: filters.search || undefined,
      dateFrom: filters.dateFrom || undefined,
      dateTo: filters.dateTo || undefined,
      stockChange: (filters.stockChange || undefined) as "positive" | "negative" | undefined,
    }),
    [page, filters.executionId, filters.search, filters.dateFrom, filters.dateTo, filters.stockChange],
  );

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
    refresh: refreshHistory,
  } = useStockUpdateHistory(historyParams);

  return (
    <div className="space-y-6">
      <FeedbackAlert feedback={feedback} />
      <FeedbackAlert feedback={runFeedback} />

      {isLoading ? (
        <InlineLoading label="Carregando configuracoes da automacao..." />
      ) : loadError ? (
        <Alert variant="danger" message={loadError} />
      ) : data ? (
        <>
          <SingleStockUpdate defaultStockTarget={data.stockAutomationStockTarget} />

          <Card>
          <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <CardTitle className="text-2xl">Estoque</CardTitle>
              <CardDescription>Configure os parametros enviados ao backend para a rotina automatica de estoque.</CardDescription>
            </div>
            <Button type="button" className="w-full md:w-auto md:self-start" onClick={() => void runNow()} disabled={isRunning}>
              {isRunning ? <Spinner /> : <Play className="size-4" />}
              Atualizar estoque
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 pt-0 pb-5">
            <StockForm
              key={`${data.companyName}-${data.stockAutomationStockTarget}-${data.stockAutomationEnabled}-${data.flashSaleAutomationEnabled}-${data.stockAutomationProductIds.join("-")}-${data.stockAutomationStatuses.join("-")}`}
              settings={data}
              isSaving={isSaving}
              onSave={save}
            />
            </CardContent>
          </Card>
        </>
      ) : (
        <Alert variant="warning" message="A API nao retornou configuracoes da automacao para exibicao." />
      )}

      <Card>
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-2xl">Historico de atualizacao de estoque</CardTitle>
            <CardDescription>Registros detalhados de todas as atualizacoes de estoque realizadas.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 pt-0 pb-5">
          {historyError ? (
            <Alert variant="danger" message={historyError} />
          ) : null}

          <StockExecutionSummary
            execution={latestExecution}
            isLoading={isLatestExecutionLoading}
            error={latestExecutionError}
          />

          {isExecutionsLoading ? (
            <InlineLoading label="Carregando lista de execucoes..." />
          ) : executionsError ? (
            <Alert variant="danger" message={executionsError} />
          ) : (
            <StockHistoryFilters
              executions={executions ?? []}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          )}

          <StockHistoryTable
            items={historyData?.items ?? []}
            isLoading={isHistoryLoading}
            page={historyData?.page ?? page}
            total={historyData?.total ?? 0}
            limit={historyData?.limit ?? 50}
            onPageChange={setPage}
          />
        </CardContent>
      </Card>
    </div>
  );
}