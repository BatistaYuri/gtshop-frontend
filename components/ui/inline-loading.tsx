import { Spinner } from "@/components/ui/spinner";

export function InlineLoading({ label = "Carregando..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white/72 px-4 py-5 text-sm text-foreground-soft">
      <Spinner />
      {label}
    </div>
  );
}
