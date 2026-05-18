import { Alert } from "@/components/ui/alert";

export function FlashSalesErrorsList({ errors }: { errors: string[] }) {
  if (errors.length === 0) {
    return null;
  }

  return (
    <section className="space-y-3">
      <Alert
        variant="warning"
        title="Atencao na execucao"
        message="Algumas ofertas nao puderam ser replicadas. Revise os itens abaixo antes de tentar novamente."
      />

      <div className="rounded-[24px] border border-secondary/24 bg-secondary/10 p-4">
        <ul className="space-y-2 text-sm leading-6 text-foreground-soft">
          {errors.map((message, index) => (
            <li key={`${message}-${index}`} className="rounded-2xl bg-white/70 px-3 py-2">
              {message}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}