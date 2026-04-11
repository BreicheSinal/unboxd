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
      title="Why Choose Unboxd"
      subtitle="Authentic shirts, reliable delivery, and support that actually responds."
      tone={tone}
    >
      <div className={`${homeSectionTheme.panelClass} mx-auto w-full max-w-6xl overflow-hidden`}>
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-[var(--brand-light-purple)] p-8 text-[var(--brand-dark-azure)] md:p-12">
            <div className="mx-auto flex h-full max-w-xl flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-vivid-red)]">
                Trusted by Football Fans
              </p>
              <h3 className="mt-5 text-3xl font-black uppercase leading-[0.95] md:text-5xl">
                Real Kits. Better Surprises.
              </h3>
              <p className="mt-6 text-base leading-relaxed opacity-85 md:text-lg">
                We curate each box around your preferences, then ship fast with
                tracking and support from a team that knows football shirts.
              </p>
              <p className="mt-4 text-base leading-relaxed opacity-85 md:text-lg">
                Our flexible returns policy allows for full refunds or exchanges
                if you&apos;re not completely satisfied.
              </p>

              <div className="mt-10 grid grid-cols-2 border border-[var(--brand-dark-azure)]">
                <div className="border-r border-[var(--brand-dark-azure)] bg-[var(--brand-dark-azure)] p-5 text-[var(--brand-light-purple)]">
                  <p className="text-3xl font-black leading-none">5+ yrs</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] opacity-80">
                    Mystery shirt curation
                  </p>
                </div>
                <div className="bg-[var(--brand-dark-azure)] p-5 text-[var(--brand-light-purple)]">
                  <p className="text-3xl font-black leading-none">30D</p>
                  <p className="mt-2 text-xs uppercase tracking-[0.1em] opacity-80">
                    Easy return window
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative isolate min-h-[320px] overflow-hidden bg-[var(--brand-dark-azure)] md:min-h-[560px]">
            <img
              src="https://images.unsplash.com/photo-1724609105918-d08de6736784?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMHN0b3JlJTIwc3BvcnRzJTIwY29sbGVjdGlvbnxlbnwxfHx8fDE3NzQ1MDI0ODh8MA&ixlib=rb-4.1.0&q=80&w=1200"
              alt="Curated football shirt collection"
              className="absolute inset-0 h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark-azure)] via-[var(--brand-dark-azure)]/65 to-[var(--brand-dark-azure)]/30" />
            <div className="pointer-events-none absolute -right-16 top-8 h-56 w-56 rounded-full bg-[var(--brand-vivid-red)]/30 blur-3xl" />

            <div className="relative z-10 flex h-full flex-col justify-end p-8 text-[var(--brand-light-purple)] md:p-12">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-vivid-red)]">
                  Why Fans Stay With Us
                </p>
                <h3 className="mt-4 max-w-sm text-3xl font-black uppercase leading-[0.95] md:text-4xl">
                  Reliable drops, real value, zero stress.
                </h3>
              </div>

              <div className="mt-8 border border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)]/40 backdrop-blur-sm">
                {["Worldwide shipping support", "Hand-picked club variety", "Fast issue resolution"].map(
                  (item) => (
                    <div
                      key={item}
                      className="border-b border-[var(--brand-light-purple)]/20 px-4 py-3 text-sm font-medium last:border-b-0"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </HomeSectionLayout>
  );
}
