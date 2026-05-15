"use client";

import type { InputHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "field-shell h-12 w-full rounded-2xl px-4 text-sm text-foreground outline-none placeholder:text-foreground-soft/70",
        className,
      )}
      {...props}
    />
  );
}