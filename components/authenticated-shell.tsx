"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, Menu, Settings2, Store, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const navigation = [
  { href: ROUTES.dashboard, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.stock, label: "Estoque", icon: Settings2 },
  { href: ROUTES.shopee, label: "Shopee", icon: Store },
];

function NavigationLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-2">
      {navigation.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition [&_span]:transition-colors [&_svg]:transition-colors",
              isActive
                ? "bg-foreground text-white shadow-[0_16px_32px_rgba(20,51,59,0.22)] [&_span]:text-white [&_svg]:text-white"
                : "text-foreground-soft hover:bg-white/70 hover:text-foreground hover:[&_span]:text-foreground hover:[&_svg]:text-foreground",
            )}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const hasCompactHeader = pathname === ROUTES.dashboard || pathname === ROUTES.stock || pathname === ROUTES.shopee;

  if (isLoading) {
    return <LoadingScreen label="Validando sessao ativa..." />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="page-shell min-h-screen px-4 py-4 md:px-6 md:py-6">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] max-w-[1600px] gap-4 lg:min-h-[calc(100vh-3rem)] lg:gap-6">
        <aside className="glass-panel soft-scrollbar hidden w-[290px] shrink-0 rounded-[32px] p-6 lg:block">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.22em] text-foreground-soft">Navegacao</p>
            <NavigationLinks />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col gap-4 lg:gap-6">
          {hasCompactHeader ? (
            <div className="lg:hidden">
              <Button
                variant="subtle"
                size="sm"
                className="glass-panel rounded-2xl"
                onClick={() => setIsMobileMenuOpen((current) => !current)}
              >
                {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </Button>
            </div>
          ) : (
            <header className="glass-panel flex items-center justify-between gap-3 rounded-[28px] px-4 py-4 md:px-6">
              <div className="flex items-center gap-3">
                <Button
                  variant="subtle"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setIsMobileMenuOpen((current) => !current)}
                >
                  {isMobileMenuOpen ? <X className="size-4" /> : <Menu className="size-4" />}
                </Button>
                <div>
                  <p className="text-xs uppercase tracking-[0.24em] text-foreground-soft">Painel administrativo</p>
                  <h1 className="text-2xl font-semibold">Operacao Shopee</h1>
                </div>
              </div>

              <p className="hidden text-sm text-foreground-soft md:block">Visao geral da operacao e acessos rapidos.</p>
            </header>
          )}

          {isMobileMenuOpen ? (
            <div className="glass-panel rounded-[28px] p-4 lg:hidden">
              <NavigationLinks onNavigate={() => setIsMobileMenuOpen(false)} />
              <Button variant="ghost" className="mt-3 w-full justify-start" onClick={() => logout()}>
                <LogOut className="size-4" />
                Sair
              </Button>
            </div>
          ) : null}

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}