import { Boxes, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

export function BrandMark({ compact = false, className }: { compact?: boolean; className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex size-12 items-center justify-center rounded-2xl bg-foreground text-white shadow-[0_18px_40px_rgba(20,51,59,0.2)]">
        <Boxes className="size-5" />
        <Sparkles className="absolute -right-1 -top-1 size-4 rounded-full bg-secondary p-0.5 text-white" />
      </div>
      {!compact ? (
        <div>
          <p className="font-display text-lg font-semibold tracking-[-0.03em] text-foreground">GTShop Admin</p>
          <p className="text-xs uppercase tracking-[0.24em] text-foreground-soft">Shopee stock control</p>
        </div>
      ) : null}
    </div>
  );
}