import { siteContent } from "@/lib/content";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CopyableField } from "@/components/ui/CopyableField";

export function GiftInfo() {
  const { gift } = siteContent;
  return (
    <section id="gift" className="py-20 sm:py-28">
      <Container>
        <SectionHeading eyebrow="With love" title="Wedding Gift" />
        <p className="mx-auto mt-6 max-w-md text-center text-sm text-starlight-dim">
          {gift.note}
        </p>

        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xs tracking-[0.25em] text-gold-400 uppercase">
              Bank Transfer
            </h3>
            <div className="space-y-3">
              {gift.bankTransfers.map((bank) => (
                <CopyableField
                  key={bank.accountNumber}
                  label={`${bank.bankName} — ${bank.accountName}`}
                  value={bank.accountNumber}
                />
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-xs tracking-[0.25em] text-gold-400 uppercase">
              E-Wallet
            </h3>
            <div className="space-y-3">
              {gift.eWallets.map((wallet) => (
                <CopyableField
                  key={wallet.number}
                  label={`${wallet.provider} — ${wallet.name}`}
                  value={wallet.number}
                />
              ))}
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
