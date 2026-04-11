import { Link } from "react-router";
import {
  ShoppingCart,
  Ruler,
  ShieldMinus,
  Truck,
  Shirt,
  CheckCircle2,
} from "lucide-react";
import { motion } from "motion/react";
import { HomeSectionLayout } from "./HomeSectionLayout";
import type { HomeSectionTone } from "./HomeSectionLayout";
import { homeSectionTheme } from "./homeSectionTheme";

const steps = [
  {
    icon: ShoppingCart,
    title: "Pick Your Mystery Box",
    description:
      "Choose your football mystery shirt box and decide how often you want to receive it.",
    detail: "Single order or recurring drops",
  },
  {
    icon: Ruler,
    title: "Select Size",
    description:
      "Set your exact fit so your shirt arrives match-ready from day one.",
    detail: "Adult and youth sizing options",
  },
  {
    icon: ShieldMinus,
    title: "Set Team Exclusions",
    description:
      "Tell us the clubs, leagues, or colors you do not want so the surprise still feels right.",
    detail: "Optional but recommended",
  },
  {
    icon: Truck,
    title: "Wait For Delivery",
    description:
      "Our team packs and ships your box quickly with tracking updates straight to your inbox.",
    detail: "Fast dispatch and secure packaging",
  },
  {
    icon: Shirt,
    title: "Unbox And Wear",
    description:
      "Open your mystery shirt, share your pull, and grow your collection with every order.",
    detail: "Rare picks and global club variety",
  },
];

type HowItWorksSectionProps = {
  tone?: HomeSectionTone;
};

export function HowItWorksSection({ tone = "light" }: HowItWorksSectionProps) {
  return (
    <HomeSectionLayout
      id="how-it-works"
      title="How It Works"
      subtitle="Build your football shirt collection in five clear steps"
      className="scroll-mt-20"
      tone={tone}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[1.05fr_1.2fr_1fr]">
        <div
          className={`${homeSectionTheme.panelClass} flex flex-col justify-between p-7 md:p-8`}
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--brand-vivid-red)]">
              Mystery Football
            </p>
            <h3 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
              The smartest way to grow your shirt collection.
            </h3>
            <p className="mt-5 text-base leading-relaxed opacity-85 md:text-lg">
              Each order is guided by your size and exclusions, then curated by
              our team to keep every unboxing fresh.
            </p>
          </div>

          <Link
            to="/order/size"
            className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-[var(--brand-vivid-red)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#c30f37] md:w-fit"
          >
            Start Your Box
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:auto-rows-fr">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                viewport={{ once: true }}
                className={`relative overflow-hidden rounded-2xl border border-[var(--brand-dark-azure)] bg-[var(--brand-dark-azure)] p-5 text-[var(--brand-light-purple)] ${
                  index === 0 ? "sm:col-span-2" : ""
                }`}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--brand-vivid-red)]/30 blur-2xl" />
                <div className="relative flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between">
                    <span className="text-3xl font-extrabold leading-none text-white/85">
                      {index + 1}
                    </span>
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[var(--brand-light-purple)]/15 text-[var(--brand-light-purple)]">
                      <Icon className="h-5 w-5" />
                    </span>
                  </div>
                  <h4 className="text-lg font-bold leading-snug">{step.title}</h4>
                  <p className="mt-2 text-sm leading-relaxed opacity-85">
                    {step.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--brand-vivid-red)]">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="rounded-2xl border border-[var(--brand-dark-azure)]/20 bg-[var(--brand-light-purple)] p-7 text-[var(--brand-dark-azure)] md:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--brand-vivid-red)]">
            Why This Flow Works
          </p>
          <p className="mt-5 text-base leading-relaxed opacity-85 md:text-lg">
            You keep control over fit and exclusions while we handle the
            discovery. That means better surprises with less guesswork.
          </p>

          <div className="mt-7 space-y-3">
            {[
              "Clear sizing and preferences before checkout",
              "No duplicates from teams you choose to avoid",
              "Curated shirts from clubs and leagues worldwide",
              "Tracked shipping and support after every order",
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 rounded-xl border border-[var(--brand-dark-azure)]/20 bg-white/60 px-3 py-3"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-vivid-red)]" />
                <p className="text-sm leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomeSectionLayout>
  );
}
