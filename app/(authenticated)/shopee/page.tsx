"use client";

import { Link2, RefreshCcw } from "lucide-react";
import { Suspense, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useShopeeStatus } from "@/hooks/useShopeeStatus";
import { compactMessage, formatDateTime, getShopeeConnected, humanizeStatus } from "@/lib/utils";

function ShopeePageContent() {
  const searchParams = useSearchParams();
  const { data, isLoading, error, feedback, connect, refreshToken, isConnecting, isRefreshingToken } = useShopeeStatus();
  const connected = getShopeeConnected(data || undefined);

  const callbackAlert = useMemo(() => {
    const success = searchParams.get("success");
    const message = searchParams.get("message");
    const shopId = searchParams.get("shopId");

    if (!success && !message && !shopId) {
      return null;
    }

    const normalizedSuccess = (success || "").toLowerCase();
    const isSuccess = ["1", "true", "ok", "success"].includes(normalizedSuccess);
    const baseMessage = message || (isSuccess ? "Autorizacao concluida com sucesso." : "O retorno da Shopee foi recebido.");

    return {
      type: isSuccess ? "success" : "warning",
      message: shopId ? `${baseMessage} Shop ID: ${shopId}.` : baseMessage,
    } as const;
  }, [searchParams]);

  return (
    <div className="space-y-6">
      {callbackAlert ? <Alert variant={callbackAlert.type} message={callbackAlert.message} /> : null}
      {feedback ? <Alert variant={feedback.type === "success" ? "success" : "danger"} message={feedback.message} /> : null}

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <div className="space-y-2">
              <CardTitle className="text-2xl">Status atual</CardTitle>
              <CardDescription>Resumo da autorizacao e dados retornados pelo backend da Shopee.</CardDescription>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="flex items-center gap-3 rounded-2xl bg-white/72 px-4 py-5 text-sm text-foreground-soft">
                <Spinner /> Carregando status da Shopee...
              </div>
            ) : error ? (
              <Alert variant="danger" message={error} />
            ) : (
              <>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-border bg-white/74 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Conexao</p>
                    <div className="mt-3 flex items-center gap-3">
                      <h3 className="text-3xl font-semibold">{connected ? "Conectada" : "Nao conectada"}</h3>
                      <Badge variant={connected ? "success" : "warning"}>{connected ? "Ativa" : "Pendente"}</Badge>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-foreground-soft">
                      {compactMessage(data?.message as string | null | undefined, "Acompanhe aqui o estado atual da autorizacao da loja na Shopee.")}
                    </p>
                  </div>

                  <div className="rounded-[28px] border border-border bg-white/74 p-5">
                    <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Identificacao</p>
                    <div className="mt-3 space-y-2 text-sm">
                      <p>
                        <span className="font-semibold text-foreground">Shop ID:</span> {data?.shopId ?? "Nao informado"}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Status:</span> {humanizeStatus(data?.status || null)}
                      </p>
                      <p>
                        <span className="font-semibold text-foreground">Shop Name:</span> {data?.shopName || "Nao informado"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-[28px] border border-border bg-white/74 p-5 text-sm leading-7 text-foreground-soft">
                    <p className="font-semibold text-foreground">Expiracao do access token</p>
                    <p>{formatDateTime((data?.accessTokenExpiresAt as string | null | undefined) || null)}</p>
                  </div>
                  <div className="rounded-[28px] border border-border bg-white/74 p-5 text-sm leading-7 text-foreground-soft">
                    <p className="font-semibold text-foreground">Expiracao do refresh token</p>
                    <p>{formatDateTime((data?.refreshTokenExpiresAt as string | null | undefined) || null)}</p>
                  </div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Acoes da integracao</CardTitle>
            <CardDescription>Inicie a conexao ou force a renovacao manual do token quando necessario.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-[28px] border border-border bg-white/74 p-5">
              <p className="text-lg font-semibold text-foreground">Conectar conta Shopee</p>
              <p className="mt-2 text-sm leading-6 text-foreground-soft">
                O frontend solicita a URL de autorizacao ao backend e redireciona o navegador para a Shopee.
              </p>
              <Button className="mt-4 w-full sm:w-auto" onClick={() => void connect()} disabled={isConnecting}>
                {isConnecting ? <Spinner /> : <Link2 className="size-4" />}
                Iniciar conexao
              </Button>
            </div>

            <div className="rounded-[28px] border border-border bg-white/74 p-5">
              <p className="text-lg font-semibold text-foreground">Refresh manual do token</p>
              <p className="mt-2 text-sm leading-6 text-foreground-soft">
                Dispare o endpoint de renovacao manual e atualize o status logo em seguida.
              </p>
              <Button className="mt-4 w-full sm:w-auto" variant="secondary" onClick={() => void refreshToken()} disabled={isRefreshingToken}>
                {isRefreshingToken ? <Spinner /> : <RefreshCcw className="size-4" />}
                Atualizar token agora
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function ShopeePage() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center gap-3 rounded-2xl bg-white/72 px-4 py-5 text-sm text-foreground-soft">
          <Spinner /> Carregando modulo Shopee...
        </div>
      }
    >
      <ShopeePageContent />
    </Suspense>
  );
}