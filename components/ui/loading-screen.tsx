import { Spinner } from "@/components/ui/spinner";

export function LoadingScreen({ label = "Carregando painel..." }: { label?: string }) {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-4 py-6 pt-[max(1.5rem,env(safe-area-inset-top))] pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-6">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center gap-4 rounded-[32px] px-6 py-8 text-center sm:px-8 sm:py-10">
        <div className="flex size-14 items-center justify-center rounded-2xl bg-primary text-white">
          <Spinner className="size-6" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold">GTShop Admin</h1>
          <p className="text-sm text-foreground-soft">{label}</p>
        </div>
      </div>
    </div>
  );
}