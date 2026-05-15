"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";
import { Alert } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { ROUTES } from "@/lib/constants";
import { toErrorMessage } from "@/lib/errors";
import { shopeeService } from "@/services/shopee-service";
import type { ShopeeCallbackPayload, ShopeeCallbackResponse } from "@/types/api";

function getCallbackPayload(searchParams: URLSearchParams): ShopeeCallbackPayload | null {
  const code = searchParams.get("code")?.trim();
  const rawShopId = searchParams.get("shop_id")?.trim();

  if (!code || !rawShopId) {
    return null;
  }

  const shopId = Number(rawShopId);

  if (!Number.isFinite(shopId)) {
    return null;
  }

  return {
    code,
    shopId,
  };
}

function ShopeeCallbackContent() {
  const searchParams = useSearchParams();
  const queryString = searchParams.toString();
  const callbackPayload = useMemo(() => getCallbackPayload(new URLSearchParams(queryString)), [queryString]);
  const invalidCallbackError = callbackPayload ? null : "Callback invalido da Shopee. Os parametros code e shop_id sao obrigatorios.";
  const [result, setResult] = useState<ShopeeCallbackResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(() => callbackPayload !== null);
  const submittedQueryRef = useRef<string | null>(null);

  useEffect(() => {
    if (!callbackPayload) {
      return;
    }

    if (submittedQueryRef.current === queryString) {
      return;
    }

    submittedQueryRef.current = queryString;

    let cancelled = false;

    const submit = async () => {
      setIsSubmitting(true);
      setError(null);

      try {
        const response = await shopeeService.submitCallback(callbackPayload);

        if (!cancelled) {
          setResult(response);
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(toErrorMessage(nextError, "Nao foi possivel confirmar o retorno da Shopee com o backend."));
        }
      } finally {
        if (!cancelled) {
          setIsSubmitting(false);
        }
      }
    };

    void submit();

    return () => {
      cancelled = true;
    };
  }, [callbackPayload, queryString]);

  const successMessage = result?.message || "Conexao com a Shopee concluida com sucesso.";
  const visibleError = error || invalidCallbackError;
  const visibleSubmitting = callbackPayload ? isSubmitting : false;

  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
      <Card className="w-full max-w-xl">
        <CardHeader className="space-y-4">
          <BrandMark />
          <div className="space-y-2">
            <CardTitle className="text-3xl">Confirmacao da Shopee</CardTitle>
            <CardDescription>Estamos finalizando a conexao da sua loja com a Shopee.</CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {visibleSubmitting ? (
            <div className="flex items-center gap-3 rounded-2xl border border-border bg-white/70 px-4 py-4 text-sm text-foreground-soft">
              <Spinner /> Enviando os dados de autorizacao para o backend...
            </div>
          ) : null}

          {visibleError ? <Alert variant="danger" title="Falha na conexao com a Shopee" message={visibleError} /> : null}

          {!visibleSubmitting && !visibleError && result ? (
            <Alert
              variant="success"
              title="Conexao concluida"
              message={result.shopId ? `${successMessage} Shop ID: ${result.shopId}.` : successMessage}
            />
          ) : null}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Link href={ROUTES.dashboard} className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-4 text-sm font-semibold text-white transition hover:bg-primary-strong">
              Voltar para dashboard
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ShopeeCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="page-shell flex min-h-screen items-center justify-center px-4 py-10">
          <Card className="w-full max-w-xl">
            <CardContent className="flex items-center gap-3 py-8 text-sm text-foreground-soft">
              O retorno da Shopee esta sendo processado...
            </CardContent>
          </Card>
        </div>
      }
    >
      <ShopeeCallbackContent />
    </Suspense>
  );
}