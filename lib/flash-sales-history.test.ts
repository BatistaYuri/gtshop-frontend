import { describe, expect, it } from "vitest";
import {
  DEFAULT_FLASH_SALE_HISTORY_FILTERS,
  mapFlashSaleHistoryItemToRow,
  parseFlashSaleHistoryQuery,
  serializeFlashSaleHistoryQuery,
  toFlashSaleHistoryRequestParams,
} from "@/lib/flash-sales-history";

describe("flash-sales-history query helpers", () => {
  it("serializes non-default filters and page to URLSearchParams", () => {
    const query = serializeFlashSaleHistoryQuery({
      page: 3,
      limit: 100,
      filters: {
        executionId: 77,
        search: "campanha teste",
        status: "ERROR",
        dateFrom: "2026-05-01",
        dateTo: "2026-05-10",
      },
    });

    expect(query.toString()).toBe(
      "page=3&limit=100&executionId=77&search=campanha+teste&status=ERROR&dateFrom=2026-05-01&dateTo=2026-05-10",
    );
  });

  it("parses URLSearchParams into normalized state with defaults", () => {
    const parsed = parseFlashSaleHistoryQuery(
      new URLSearchParams("executionId=10&search=abc&status=SUCCESS&dateFrom=2026-04-01&page=2"),
    );

    expect(parsed).toEqual({
      page: 2,
      limit: 50,
      filters: {
        executionId: 10,
        search: "abc",
        status: "SUCCESS",
        dateFrom: "2026-04-01",
        dateTo: "",
      },
    });
  });

  it("converts date filters to ISO datetimes for backend params", () => {
    const requestParams = toFlashSaleHistoryRequestParams({
      page: 1,
      limit: 50,
      filters: {
        ...DEFAULT_FLASH_SALE_HISTORY_FILTERS,
        dateFrom: "2026-05-01",
        dateTo: "2026-05-05",
      },
    });

    expect(requestParams.dateFrom).toBeTruthy();
    expect(requestParams.dateTo).toBeTruthy();

    const dateFrom = new Date(requestParams.dateFrom as string).getTime();
    const dateTo = new Date(requestParams.dateTo as string).getTime();

    expect(dateFrom).toBeLessThan(dateTo);

    const diffInHours = (dateTo - dateFrom) / (1000 * 60 * 60);
    expect(diffInHours).toBeGreaterThanOrEqual(24 * 4);
  });
});

describe("mapFlashSaleHistoryItemToRow", () => {
  it("maps flash sale history API item to table row shape", () => {
    const row = mapFlashSaleHistoryItemToRow({
      id: 20,
      executionId: 12,
      userId: 1,
      sourceFlashSaleId: 101,
      targetFlashSaleId: null,
      flashSaleName: "Oferta Teste",
      targetDate: "2026-05-29T00:00:00.000Z",
      status: "SKIPPED",
      errorMessage: null,
      createdAt: "2026-05-28T12:00:00.000Z",
    });

    expect(row).toEqual({
      id: 20,
      createdAt: "2026-05-28T12:00:00.000Z",
      executionLabel: "#12",
      sourceFlashSaleLabel: "#101",
      targetFlashSaleLabel: "-",
      flashSaleName: "Oferta Teste",
      targetDate: "2026-05-29T00:00:00.000Z",
      status: "SKIPPED",
      errorMessage: "-",
    });
  });
});