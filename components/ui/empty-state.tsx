import type { ReactNode } from "react";
import { Card, CardContent } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <Card>
      <CardContent className="flex flex-col gap-4 py-10 text-center">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">{title}</h3>
          <p className="mx-auto max-w-lg text-sm leading-6 text-foreground-soft">{description}</p>
        </div>
        {action ? <div className="flex justify-center">{action}</div> : null}
      </CardContent>
    </Card>
  );
}