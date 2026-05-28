"use client";

import { Children, cloneElement, isValidElement, type ButtonHTMLAttributes, type ReactElement } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "subtle";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-white shadow-[0_14px_30px_rgba(14,95,109,0.22)] hover:bg-primary-strong focus-visible:outline-primary",
  secondary:
    "bg-secondary text-white shadow-[0_14px_30px_rgba(221,143,70,0.18)] hover:brightness-95 focus-visible:outline-secondary",
  ghost:
    "bg-transparent text-foreground hover:bg-surface-accent focus-visible:outline-primary",
  danger:
    "bg-danger text-white shadow-[0_14px_30px_rgba(161,61,50,0.16)] hover:brightness-95 focus-visible:outline-danger",
  subtle:
    "bg-white/80 text-foreground ring-1 ring-inset ring-border hover:bg-white focus-visible:outline-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-5 text-base",
};

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
  asChild?: boolean;
}

export function Button({
  children,
  className,
  variant = "primary",
  size = "md",
  fullWidth = false,
  asChild = false,
  ...props
}: ButtonProps) {
  const classes = cn(
    "inline-flex touch-manipulation items-center justify-center gap-2 rounded-2xl font-semibold transition duration-200 ease-out disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2",
    variantClasses[variant],
    sizeClasses[size],
    fullWidth && "w-full",
    className,
  );

  if (asChild) {
    const child = Children.only(children);

    if (!isValidElement(child)) {
      return null;
    }

    return cloneElement(child as ReactElement<{ className?: string }>, {
      className: cn(classes, (child.props as { className?: string }).className),
      ...props,
    });
  }

  return (
    <button
      className={classes}
      {...props}
    >
      {children}
    </button>
  );
}