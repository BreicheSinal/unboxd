import { ShoppingCart, Package, Gift } from "lucide-react";
import { motion } from "motion/react";
import { HomeSectionLayout } from "./HomeSectionLayout";
import type { HomeSectionTone } from "./HomeSectionLayout";
import { homeSectionTheme } from "./homeSectionTheme";

const steps = [
  {
    icon: ShoppingCart,
    title: "Choose Size",
    description: "Select your preferred shirt size",
  },
  {
    icon: Package,
    title: "Set Exclusions",
    description: "Avoid specific teams, leagues, or colors",
  },
  {
    icon: Gift,
    title: "Receive Shirt",
    description: "Get your mystery shirt delivered!",
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
      subtitle="Get your mystery shirt in three simple steps"
      className="scroll-mt-20"
      tone={tone}
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step, index) => {
          const Icon = step.icon;

          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
              className="relative h-full"
            >
              <div
                className={`${homeSectionTheme.panelClass} flex h-full min-h-[260px] flex-col items-center p-8 text-center`}
              >
                <div className="absolute -left-4 -top-4 flex h-8 w-8 items-center justify-center rounded-full bg-red-600 font-bold text-white">
                  {index + 1}
                </div>
                <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-rose-500 to-red-700 text-white">
                  <Icon className="h-8 w-8" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{step.title}</h3>
                <p className="opacity-80">{step.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </HomeSectionLayout>
  );
}
