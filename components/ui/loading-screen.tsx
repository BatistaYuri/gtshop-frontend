import { Spinner } from "@/components/ui/spinner";

export function LoadingScreen({ label = "Carregando painel..." }: { label?: string }) {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-6">
      <div className="glass-panel flex w-full max-w-sm flex-col items-center gap-4 rounded-[32px] px-8 py-10 text-center">
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