import { Link } from "react-router";
import { HomeSectionLayout } from "./HomeSectionLayout";

export function CtaSection() {
  return (
    <HomeSectionLayout tone="dark">
      <div className="mx-auto w-full max-w-6xl border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)]">
        <div className="grid grid-cols-1 gap-8 p-8 md:grid-cols-[1fr_auto] md:items-end md:p-12">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-vivid-red)]">
              Final Call
            </p>
            <h2 className="mt-5 max-w-xl text-4xl font-black uppercase leading-[0.95] md:text-6xl">
              Ready For Your Mystery?
            </h2>
            <p className="mt-5 max-w-xl text-base leading-relaxed opacity-80 md:text-lg">
              Lock your size, set exclusions, and let the next surprise shirt
              find you.
            </p>
          </div>
          <div className="md:pb-1">
            <Link
              to="/order/size"
              className="inline-flex items-center justify-center border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] px-8 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#c30f37]"
            >
              Order Your Mystery Shirt
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 border-t border-[var(--brand-light-purple)]/20 sm:grid-cols-3">
          {["100% authentic shirts", "Tracked global delivery", "30-day returns"].map(
            (item) => (
              <div
                key={item}
                className="border-b border-[var(--brand-light-purple)]/20 px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-light-purple)]/80 last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0"
              >
                {item}
              </div>
            ),
          )}
        </div>
      </div>
    </HomeSectionLayout>
  );
}
