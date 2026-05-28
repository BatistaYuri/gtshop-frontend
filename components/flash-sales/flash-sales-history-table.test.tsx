import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FlashSalesHistoryTable } from "@/components/flash-sales/flash-sales-history-table";

describe("FlashSalesHistoryTable", () => {
  it("renders loading state", () => {
    render(
      <FlashSalesHistoryTable
        items={[]}
        isLoading
        error={null}
        page={1}
        total={0}
        limit={50}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByText("Carregando historico de replicacao...")).toBeInTheDocument();
  });

  it("renders error state", () => {
    render(
      <FlashSalesHistoryTable
        items={[]}
        isLoading={false}
        error="Falha ao carregar"
        page={1}
        total={0}
        limit={50}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByText("Falha ao carregar")).toBeInTheDocument();
  });

  it("renders empty state", () => {
    render(
      <FlashSalesHistoryTable
        items={[]}
        isLoading={false}
        error={null}
        page={1}
        total={0}
        limit={50}
        onPageChange={() => {}}
      />,
    );

    expect(screen.getByText("Nenhum registro encontrado")).toBeInTheDocument();
  });
});