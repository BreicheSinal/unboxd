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
      subtitle="Build your football shirt collection in five clear moves."
      className="scroll-mt-20"
      tone={tone}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className={`${homeSectionTheme.panelClass} flex flex-col justify-between p-8 md:p-10`}>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[var(--brand-vivid-red)]">
              Mystery Football
            </p>
            <h3 className="mt-5 text-3xl font-black uppercase leading-[0.95] md:text-5xl">
              Five Steps. Zero Noise.
            </h3>
            <p className="mt-6 max-w-lg text-base leading-relaxed opacity-85 md:text-lg">
              You set the fit and exclusions. We handle the curation. Every drop
              stays surprising without becoming random.
            </p>
          </div>

          <Link
            to="/order/size"
            className="mt-10 inline-flex w-full items-center justify-center border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] px-6 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors hover:bg-[#c30f37] md:w-fit"
          >
            Start Your Box
          </Link>
        </div>

        <div className="border border-[var(--brand-dark-azure)] bg-[var(--brand-light-purple)]/60">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12 }}
                viewport={{ once: true }}
                className="grid grid-cols-[auto_1fr] gap-4 border-b border-[var(--brand-dark-azure)]/25 p-5 text-[var(--brand-dark-azure)] last:border-b-0 md:grid-cols-[72px_1fr] md:gap-6 md:p-6"
              >
                <div className="flex items-start gap-3 md:flex-col md:gap-4">
                  <span className="text-2xl font-black leading-none text-[var(--brand-vivid-red)] md:text-3xl">
                    {index + 1}
                  </span>
                  <span className="inline-flex h-10 w-10 items-center justify-center border border-[var(--brand-dark-azure)]/30 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)] md:h-11 md:w-11">
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <div>
                  <h4 className="text-lg font-bold uppercase leading-snug md:text-xl">
                    {step.title}
                  </h4>
                  <p className="mt-2 text-sm leading-relaxed opacity-85 md:text-base">
                    {step.description}
                  </p>
                  <p className="mt-3 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--brand-vivid-red)]">
                    {step.detail}
                  </p>
                </div>
              </motion.div>
            );
          })}

          <div className="grid grid-cols-1 border-t border-[var(--brand-dark-azure)]/25 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)] sm:grid-cols-2">
            {[
              "Sizing and preferences locked before checkout",
              "No duplicates from teams you exclude",
              "Clubs and leagues sourced globally",
              "Tracked shipping plus responsive support",
            ].map((point) => (
              <div
                key={point}
                className="flex items-start gap-3 border-b border-[var(--brand-light-purple)]/20 px-5 py-4 text-sm leading-relaxed last:border-b-0 sm:border-r sm:last:border-r-0 sm:[&:nth-last-child(-n+2)]:border-b-0"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand-vivid-red)]" />
                <p>{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HomeSectionLayout>
  );
}
