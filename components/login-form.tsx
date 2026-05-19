"use client";

import { ArrowRight, LockKeyhole, UserRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { safeRedirectPath } from "@/lib/utils";

export function LoginForm({ redirectTo }: { redirectTo?: string }) {
  const router = useRouter();
  const { login, isAuthenticating, error, clearError } = useAuth();
  const [form, setForm] = useState({ username: "", password: "" });
  const [validationError, setValidationError] = useState<string | null>(null);

  const nextPath = useMemo(() => safeRedirectPath(redirectTo, ROUTES.dashboard), [redirectTo]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    clearError();

    if (!form.username.trim() || !form.password.trim()) {
      setValidationError("Informe username e password para entrar.");
      return;
    }

    setValidationError(null);

    try {
      await login({
        username: form.username.trim(),
        password: form.password,
      });
      router.replace(nextPath);
    } catch {
      return;
    }
  }

  return (
    <div className="page-shell flex min-h-dvh items-center justify-center px-4 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:py-10 md:px-6">
      <div className="w-full max-w-xl">
        <Card>
          <CardHeader className="space-y-4 p-5 sm:p-6">
            <div className="flex items-start justify-between gap-3 sm:items-center">
              <div>
                <CardTitle className="text-2xl sm:text-3xl">Entrar</CardTitle>
                <CardDescription>Use as credenciais do painel administrativo para continuar.</CardDescription>
              </div>
              <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-foreground text-white sm:size-12">
                <LockKeyhole className="size-5" />
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-5 pb-5 sm:px-6 sm:pb-6">
            <form className="space-y-5" onSubmit={handleSubmit}>
              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Username</span>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground-soft" />
                  <Input
                    value={form.username}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, username: event.target.value }));
                      if (validationError) {
                        setValidationError(null);
                      }
                    }}
                    autoComplete="username"
                    placeholder="admin"
                    className="pl-11"
                  />
                </div>
              </label>

              <label className="block space-y-2">
                <span className="text-sm font-semibold text-foreground">Password</span>
                <div className="relative">
                  <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-foreground-soft" />
                  <Input
                    type="password"
                    value={form.password}
                    onChange={(event) => {
                      setForm((current) => ({ ...current, password: event.target.value }));
                      if (validationError) {
                        setValidationError(null);
                      }
                    }}
                    autoComplete="current-password"
                    placeholder="Sua senha"
                    className="pl-11"
                  />
                </div>
              </label>

              {validationError ? <Alert variant="warning" message={validationError} /> : null}
              {error ? <Alert variant="danger" message={error} /> : null}

              <Button type="submit" fullWidth size="lg" disabled={isAuthenticating} className="min-h-12">
                {isAuthenticating ? <Spinner /> : <ArrowRight className="size-4" />}
                Acessar painel
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}