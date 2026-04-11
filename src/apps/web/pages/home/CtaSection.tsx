import { Link } from "react-router";
import { HomeSectionLayout } from "./HomeSectionLayout";
import type { HomeSectionTone } from "./HomeSectionLayout";

type CtaSectionProps = {
  tone?: HomeSectionTone;
};

export function CtaSection({ tone = "light" }: CtaSectionProps) {
  const containerClass =
    tone === "dark"
      ? "border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)]"
      : "border border-[var(--brand-dark-azure)]/20 bg-[var(--brand-light-purple)] text-[var(--brand-dark-azure)]";
  const footerBorderClass =
    tone === "dark"
      ? "border-[var(--brand-light-purple)]/20 text-[var(--brand-light-purple)]/80"
      : "border-[var(--brand-dark-azure)]/20 text-[var(--brand-dark-azure)]/75";

  return (
    <HomeSectionLayout tone={tone}>
      <div className={`mx-auto w-full max-w-6xl ${containerClass}`}>
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

        <div className={`grid grid-cols-1 border-t sm:grid-cols-3 ${footerBorderClass}`}>
          {["100% authentic shirts", "Tracked global delivery", "30-day returns"].map(
            (item) => (
              <div
                key={item}
                className={`border-b px-6 py-4 text-xs font-semibold uppercase tracking-[0.12em] last:border-b-0 sm:border-b-0 sm:border-r sm:last:border-r-0 ${footerBorderClass}`}
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
