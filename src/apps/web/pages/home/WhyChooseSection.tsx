import { HomeSectionLayout } from "./HomeSectionLayout";
import type { HomeSectionTone } from "./HomeSectionLayout";
import { homeSectionTheme } from "./homeSectionTheme";

type WhyChooseSectionProps = {
  tone?: HomeSectionTone;
};

export function WhyChooseSection({ tone = "dark" }: WhyChooseSectionProps) {
  return (
    <HomeSectionLayout
      id="why-choose-us"
      title="Why Choose Us?"
      subtitle="Top-Quality Mystery Football Shirts. Fast Delivery + Easy Returns!"
      tone={tone}
    >
      <div
        className={`${homeSectionTheme.panelClass} mx-auto w-full max-w-6xl overflow-hidden`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[var(--brand-light-purple)] p-8 text-[var(--brand-dark-azure)] md:p-14">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--brand-vivid-red)]">
                Trusted by Football Fans
              </p>
              <p className="mt-6 text-lg leading-relaxed opacity-85 md:text-xl">
                We focus on quality, speed, and reliable support so every
                mystery shirt feels worth opening. From iconic clubs to rare
                picks, each order is curated for fans who want surprise without
                compromise.
              </p>
              <p className="mt-6 text-lg leading-relaxed opacity-85 md:text-xl">
                Our flexible returns policy allows for full refunds or exchanges
                if you&apos;re not completely satisfied.
              </p>

              <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-[var(--brand-dark-azure)]/20 bg-[var(--brand-dark-azure)] p-5 text-[var(--brand-light-purple)]">
                  <p className="text-2xl font-bold leading-none">5+ Years</p>
                  <p className="mt-2 text-sm opacity-80">
                    Delivering mystery football shirts
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--brand-dark-azure)]/20 bg-[var(--brand-dark-azure)] p-5 text-[var(--brand-light-purple)]">
                  <p className="text-2xl font-bold leading-none">
                    Easy Returns
                  </p>
                  <p className="mt-2 text-sm opacity-80">
                    Refund or exchange if not satisfied
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative isolate min-h-[320px] overflow-hidden bg-[var(--brand-dark-azure)] p-8 md:min-h-[560px] md:p-12">
            <div className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-[var(--brand-vivid-red)] opacity-25 blur-3xl" />
            <div className="pointer-events-none absolute bottom-0 left-8 h-48 w-48 rounded-full bg-[var(--brand-light-purple)] opacity-15 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-between text-[var(--brand-light-purple)]">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-vivid-red)]">
                  Why Fans Stay With Us
                </p>
                <h3 className="mt-4 max-w-sm text-3xl font-bold leading-tight md:text-4xl">
                  Reliable drops, real value, zero stress.
                </h3>
              </div>

              <div className="mt-10 space-y-3">
                <div className="rounded-2xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-light-purple)]/10 px-4 py-3">
                  <p className="text-sm font-medium">
                    Worldwide shipping support
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-light-purple)]/10 px-4 py-3">
                  <p className="text-sm font-medium">
                    Hand-picked club variety
                  </p>
                </div>
                <div className="rounded-2xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-light-purple)]/10 px-4 py-3">
                  <p className="text-sm font-medium">
                    Fast issue resolution team
                  </p>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 pt-6">
                <div className="rounded-xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-light-purple)]/10 p-3 text-center">
                  <p className="text-xl font-bold">24h</p>
                  <p className="mt-1 text-xs opacity-80">Dispatch</p>
                </div>
                <div className="rounded-xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-light-purple)]/10 p-3 text-center">
                  <p className="text-xl font-bold">100%</p>
                  <p className="mt-1 text-xs opacity-80">Authentic</p>
                </div>
                <div className="rounded-xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-light-purple)]/10 p-3 text-center">
                  <p className="text-xl font-bold">30D</p>
                  <p className="mt-1 text-xs opacity-80">Returns</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeSectionLayout>
  );
}
