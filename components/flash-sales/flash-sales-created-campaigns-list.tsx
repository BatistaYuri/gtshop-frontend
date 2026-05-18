import type { FlashSaleReplicationCreatedCampaign } from "@/types/api";

export function FlashSalesCreatedCampaignsList({
  campaigns,
  title = "Ofertas criadas",
  description = "Cada linha representa uma oferta replicada para o dia seguinte.",
  emptyMessage = "Nenhuma oferta foi criada nesta execucao.",
}: {
  campaigns: FlashSaleReplicationCreatedCampaign[];
  title?: string;
  description?: string;
  emptyMessage?: string;
}) {
  return (
    <section className="space-y-3 rounded-[24px] border border-border bg-white/72 p-4">
      <div>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-sm leading-6 text-foreground-soft">{description}</p>
      </div>

      {campaigns.length === 0 ? (
        <div className="rounded-[20px] border border-dashed border-border bg-white/70 px-4 py-5 text-sm leading-6 text-foreground-soft">
          {emptyMessage}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-separate border-spacing-0 text-left text-sm">
            <thead>
              <tr className="text-foreground-soft">
                <th className="border-b border-border px-4 py-3 font-semibold">Nome da oferta</th>
                <th className="border-b border-border px-4 py-3 font-semibold">ID de origem</th>
                <th className="border-b border-border px-4 py-3 font-semibold">ID criado</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((campaign) => (
                <tr key={`${campaign.sourceDiscountId}-${campaign.targetDiscountId}`} className="text-foreground-soft">
                  <td className="border-b border-border/70 px-4 py-3 font-medium text-foreground">{campaign.discountName}</td>
                  <td className="border-b border-border/70 px-4 py-3">{campaign.sourceDiscountId}</td>
                  <td className="border-b border-border/70 px-4 py-3">{campaign.targetDiscountId}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}