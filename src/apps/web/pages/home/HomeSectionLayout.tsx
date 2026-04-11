import type { ReactNode } from "react";
import { motion } from "motion/react";
import { homeSectionTheme } from "./homeSectionTheme";

export type HomeSectionTone = "light" | "dark";

type HomeSectionLayoutProps = {
  children: ReactNode;
  id?: string;
  title?: string;
  subtitle?: string;
  className?: string;
  tone?: HomeSectionTone;
  inverted?: boolean;
};

export function HomeSectionLayout({
  children,
  id,
  title,
  subtitle,
  className = "",
  tone = "light",
  inverted,
}: HomeSectionLayoutProps) {
  const isInverted = inverted ?? tone === "dark";
  const backgroundClass =
    tone === "dark" ? "bg-[var(--brand-dark-azure)]" : "bg-[var(--brand-light-purple)]";
  const titleClass = isInverted
    ? "max-w-4xl text-4xl font-black uppercase leading-[0.95] text-[var(--brand-light-purple)] md:text-6xl"
    : homeSectionTheme.titleClass;
  const subtitleClass = isInverted
    ? "mt-4 max-w-2xl text-base text-[var(--brand-light-purple)]/75 md:text-lg"
    : homeSectionTheme.subtitleClass;

  return (
    <motion.section
      id={id}
      className={`${homeSectionTheme.sectionClass} ${backgroundClass} ${className}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true, amount: 0.15 }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--brand-light-purple)]/20" />
      <div className={homeSectionTheme.containerClass}>
        <div className={homeSectionTheme.innerClass}>
          {(title || subtitle) && (
            <div className={homeSectionTheme.headerClass}>
              {title && <h2 className={titleClass}>{title}</h2>}
              {subtitle && <p className={subtitleClass}>{subtitle}</p>}
            </div>
          )}
          {children}
        </div>
      </div>
    </motion.section>
  );
}
