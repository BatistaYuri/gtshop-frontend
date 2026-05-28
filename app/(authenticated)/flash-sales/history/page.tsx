"use client";

import { useCallback, useMemo } from "react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FlashSalesHistoryFilters } from "@/components/flash-sales/flash-sales-history-filters";
import { FlashSalesHistoryTable } from "@/components/flash-sales/flash-sales-history-table";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { InlineLoading } from "@/components/ui/inline-loading";
import { useFlashSaleExecutions } from "@/hooks/useFlashSaleExecutions";
import { useFlashSaleHistory } from "@/hooks/useFlashSaleHistory";
import {
  DEFAULT_FLASH_SALE_HISTORY_FILTERS,
  parseFlashSaleHistoryQuery,
  serializeFlashSaleHistoryQuery,
  toFlashSaleHistoryRequestParams,
  type FlashSaleHistoryFiltersState,
} from "@/lib/flash-sales-history";
import { ROUTES } from "@/lib/constants";

export default function FlashSalesHistoryPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawSearchParams = searchParams.toString();

  const queryState = useMemo(
    () => parseFlashSaleHistoryQuery(new URLSearchParams(rawSearchParams)),
    [rawSearchParams],
  );

  const historyParams = useMemo(
    () => toFlashSaleHistoryRequestParams(queryState),
    [queryState],
  );

  const {
    data: historyData,
    isLoading: isHistoryLoading,
    error: historyError,
  } = useFlashSaleHistory(historyParams);

  const {
    data: executions,
    isLoading: isExecutionsLoading,
    error: executionsError,
  } = useFlashSaleExecutions();

  const applyQueryState = useCallback(
    (nextState: typeof queryState) => {
      const nextSearchParams = serializeFlashSaleHistoryQuery(nextState);
      const nextQueryString = nextSearchParams.toString();

      router.replace(nextQueryString ? `${pathname}?${nextQueryString}` : pathname, { scroll: false });
    },
    [pathname, router],
  );

  const handleFilterChange = useCallback(
    (filters: FlashSaleHistoryFiltersState) => {
      applyQueryState({ ...queryState, filters, page: 1 });
    },
    [applyQueryState, queryState],
  );

  const handleClearFilters = useCallback(() => {
    applyQueryState({
      ...queryState,
      page: 1,
      filters: DEFAULT_FLASH_SALE_HISTORY_FILTERS,
    });
  }, [applyQueryState, queryState]);

  const handlePageChange = useCallback(
    (page: number) => {
      applyQueryState({ ...queryState, page });
    },
    [applyQueryState, queryState],
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-col gap-4 space-y-0 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">Historico de replicacao de oferta relampago</CardTitle>
            <CardDescription>
              Consulte execucoes anteriores, filtre por periodo, status e execucao, e compartilhe a URL com os filtros aplicados.
            </CardDescription>
          </div>
          <Button asChild type="button" variant="subtle" className="w-full md:w-auto md:self-start">
            <Link href={ROUTES.flashSales}>Voltar para oferta relampago</Link>
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 pt-0 pb-5">
          {isExecutionsLoading ? (
            <InlineLoading label="Carregando lista de execucoes..." />
          ) : executionsError ? (
            <Alert variant="danger" message={executionsError} />
          ) : (
            <FlashSalesHistoryFilters
              executions={executions ?? []}
              filters={queryState.filters}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
            />
          )}

          <FlashSalesHistoryTable
            items={historyData?.items ?? []}
            isLoading={isHistoryLoading}
            error={historyError}
            page={historyData?.page ?? queryState.page}
            total={historyData?.total ?? 0}
            limit={historyData?.limit ?? queryState.limit}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}