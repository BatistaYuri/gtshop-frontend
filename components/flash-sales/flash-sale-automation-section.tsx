"use client";

import { Save } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { BooleanToggleField } from "@/components/ui/boolean-toggle-field";

export function FlashSaleAutomationSection({
  enabled,
  isSaving,
  onSave,
}: {
  enabled: boolean;
  isSaving: boolean;
  onSave: (enabled: boolean) => Promise<unknown>;
}) {
  const [isEnabled, setIsEnabled] = useState(enabled);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave(isEnabled);
  }

  return (
    <form className="space-y-4" onSubmit={handleSubmit}>
      <BooleanToggleField
        name="flash-sale-automation-enabled"
        label="Atualizar a oferta relampago todos os dias"
        value={isEnabled}
        disabled={isSaving}
        onChange={setIsEnabled}
      />

      <div className="flex flex-col gap-2.5 sm:flex-row">
        <Button type="submit" disabled={isSaving}>
          {isSaving ? <Spinner /> : <Save className="size-4" />}
          Salvar configuracoes
        </Button>
      </div>

      {isSaving ? (
        <div className="flex items-center gap-2 text-sm text-foreground-soft">
          <Spinner /> Salvando automacao de oferta relampago...
        </div>
      ) : null}
    </form>
  );
}