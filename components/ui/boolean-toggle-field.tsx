"use client";

import { cn } from "@/lib/utils";

export function BooleanToggleField({
  name,
  label,
  value,
  disabled,
  onChange,
}: {
  name: string;
  label: string;
  value: boolean;
  disabled?: boolean;
  onChange: (nextValue: boolean) => void;
}) {
  return (
    <div className="flex w-full items-center gap-2.5 sm:w-fit">
      <button
        id={name}
        type="button"
        role="switch"
        aria-checked={value}
        aria-label={label}
        disabled={disabled}
        onClick={() => onChange(!value)}
        className={cn(
          "relative inline-flex h-5 w-9 items-center rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60",
          value ? "border-primary bg-primary/85" : "border-border bg-surface-accent",
        )}
      >
        <span
          className={cn(
            "inline-block size-3.5 rounded-full bg-white shadow-sm transition",
            value ? "translate-x-5" : "translate-x-0.5",
          )}
        />
      </button>
      <label htmlFor={name} className="text-sm font-semibold text-foreground">
        {label}
      </label>
    </div>
  );
}