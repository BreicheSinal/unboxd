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
    ? "text-3xl font-bold text-[var(--brand-light-purple)] md:text-5xl"
    : homeSectionTheme.titleClass;
  const subtitleClass = isInverted
    ? "mt-3 text-lg text-[var(--brand-light-purple)] opacity-75"
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
