import type { HTMLAttributes } from "react";
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

export type AlertVariant = "info" | "success" | "warning" | "danger";

const variantClasses: Record<AlertVariant, string> = {
  info: "border-primary/20 bg-primary/8 text-primary",
  success: "border-success/20 bg-success/8 text-success",
  warning: "border-secondary/24 bg-secondary/10 text-warning",
  danger: "border-danger/20 bg-danger/8 text-danger",
};

const icons = {
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  danger: AlertCircle,
};

export function Alert({
  className,
  variant = "info",
  title,
  message,
  ...props
}: HTMLAttributes<HTMLDivElement> & {
  variant?: AlertVariant;
  title?: string;
  message: string;
}) {
  const Icon = icons[variant];

  return (
    <div
      className={cn(
        "flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-6",
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      <Icon className="mt-0.5 size-4 shrink-0" />
      <div className="space-y-1">
        {title ? <p className="font-semibold text-current">{title}</p> : null}
        <p className="text-current/90">{message}</p>
      </div>
    </div>
  );
}