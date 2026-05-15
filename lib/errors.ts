import { compactMessage } from "@/lib/utils";
import type { ApiErrorResponse } from "@/types/api";

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function toErrorMessage(error: unknown, fallback = "Ocorreu um erro inesperado.") {
  if (error instanceof ApiError) {
    return error.message;
  }

  if (error instanceof Error) {
    return compactMessage(error.message, fallback);
  }

  return fallback;
}

export function getApiErrorPayload(payload: unknown) {
  if (!payload || typeof payload !== "object") {
    return undefined;
  }

  return payload as ApiErrorResponse;
}