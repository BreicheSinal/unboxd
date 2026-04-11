import { motion } from "motion/react";
import { HomeSectionLayout } from "./HomeSectionLayout";
import type { HomeSectionTone } from "./HomeSectionLayout";
import { homeSectionTheme } from "./homeSectionTheme";

const previewDrops = [
  {
    image:
      "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=1200",
    era: "Classic Pull",
    title: "90s Heritage Shirt",
    note: "Retro sponsor era, stitched crest, collector favorite.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=1200",
    era: "Away Drop",
    title: "Modern Statement Kit",
    note: "Bold palette, match-ready fabric, clean minimal crest.",
  },
  {
    image:
      "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=1200",
    era: "Wildcard",
    title: "Rare Global Club Pick",
    note: "Unexpected club, limited season run, instant talking point.",
  },
];

type PreviewSectionProps = {
  tone?: HomeSectionTone;
};

export function PreviewSection({ tone = "light" }: PreviewSectionProps) {
  return (
    <HomeSectionLayout
      id="you-might-get"
      title="You Might Get..."
      subtitle="A few possible reveals from the next box we pack for you."
      tone={tone}
    >
      <div className="relative mx-auto w-full max-w-6xl">
        <div className="pointer-events-none absolute -left-16 top-12 h-44 w-44 rounded-full bg-[var(--brand-vivid-red)]/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-12 bottom-8 h-40 w-40 rounded-full bg-[var(--brand-dark-azure)]/20 blur-3xl" />

        <div className="mb-5 flex items-center justify-between gap-4 px-1">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--brand-vivid-red)]">
            Curated Preview
          </p>
          <p className="text-sm text-[var(--brand-dark-azure)]/70">
            Hover to sharpen the reveal
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-12 md:grid-rows-2">
          {previewDrops.map((drop, index) => (
            <motion.div
              key={`${drop.title}-${index}`}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: index * 0.12 }}
              viewport={{ once: true }}
              className={`group relative isolate overflow-hidden ${homeSectionTheme.panelClass} ${
                index === 0
                  ? "min-h-[420px] md:col-span-7 md:row-span-2 md:min-h-[560px]"
                  : "min-h-[260px] md:col-span-5"
              }`}
            >
              <img
                src={drop.image}
                alt={`Mystery shirt preview: ${drop.title}`}
                className="h-full w-full object-cover blur-[2px] transition-all duration-500 group-hover:scale-105 group-hover:blur-0"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5" />
              <div className="absolute inset-0 p-6 md:p-8">
                <div className="flex h-full flex-col justify-between">
                  <div className="inline-flex w-fit items-center rounded-full border border-white/20 bg-black/30 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
                    {drop.era}
                  </div>

                  <div>
                    <h3 className="max-w-lg text-2xl font-bold leading-tight text-white md:text-3xl">
                      {drop.title}
                    </h3>
                    <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/85 md:text-base">
                      {drop.note}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.1em] text-white/90">
                      <span className="h-2 w-2 rounded-full bg-[var(--brand-vivid-red)]" />
                      Reveal on unboxing
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </HomeSectionLayout>
  );
}
