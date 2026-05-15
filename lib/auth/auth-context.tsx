"use client";

import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTES } from "@/lib/constants";
import { clearSessionToken, getSessionToken, persistSessionToken } from "@/lib/auth/session";
import { toErrorMessage } from "@/lib/errors";
import { authService } from "@/services/auth-service";
import type { AuthUser, LoginRequest } from "@/types/api";

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginRequest) => Promise<AuthUser>;
  logout: (options?: { redirectTo?: string; silent?: boolean }) => void;
  refreshUser: () => Promise<void>;
  clearError: () => void;
};

export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const logout = useCallback(
    (options?: { redirectTo?: string; silent?: boolean }) => {
      clearSessionToken();
      setUser(null);
      setError(null);

      if (!options?.silent) {
        router.replace(options?.redirectTo ?? ROUTES.login);
      }
    },
    [router],
  );

  const refreshUser = useCallback(async () => {
    const token = getSessionToken();

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const nextUser = await authService.getMe();
      setUser(nextUser);
      setError(null);
    } catch (nextError) {
      setError(toErrorMessage(nextError, "Nao foi possivel validar sua sessao."));
      logout({ silent: pathname === ROUTES.login, redirectTo: ROUTES.login });
    } finally {
      setIsLoading(false);
    }
  }, [logout, pathname]);

  useEffect(() => {
    Promise.resolve().then(() => refreshUser());
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      logout({ redirectTo: ROUTES.login });
    };

    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, [logout]);

  const login = useCallback(async (payload: LoginRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await authService.login(payload);
      persistSessionToken(response.token);
      setUser(response.user);
      return response.user;
    } catch (nextError) {
      const message = toErrorMessage(nextError, "Falha ao autenticar.");
      setError(message);
      throw nextError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      logout,
      refreshUser,
      clearError: () => setError(null),
    }),
    [error, isLoading, login, logout, refreshUser, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}