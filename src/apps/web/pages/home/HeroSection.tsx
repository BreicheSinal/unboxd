import { Link } from "react-router";
import { motion } from "motion/react";
import { homeSectionTheme } from "./homeSectionTheme";

export function HeroSection() {
  return (
    <motion.section
      className="relative isolate flex min-h-[calc(100svh-4rem)] items-center overflow-hidden bg-[var(--brand-dark-azure)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-20 h-72 w-72 rounded-full bg-red-500/15 blur-3xl" />
        <div className="absolute -right-36 bottom-16 h-96 w-96 rounded-full bg-rose-400/10 blur-3xl" />
        <div className="absolute inset-y-0 left-1/2 w-px bg-white/10" />
      </div>

      <div className={`${homeSectionTheme.containerClass} relative z-10 py-12 md:py-16`}>
        <motion.div
          className={`${homeSectionTheme.innerClass} grid items-end gap-12 md:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-left">
            <motion.p
              className="text-xs font-semibold uppercase tracking-[0.25em] text-red-300"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.45 }}
            >
              Unboxd Mystery Shirts
            </motion.p>

            <motion.h1
              className="mt-5 max-w-[14ch] text-5xl font-black uppercase leading-[0.95] text-[var(--brand-light-purple)] md:text-7xl"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.12, duration: 0.55 }}
            >
              Wear The Unknown.
            </motion.h1>

            <motion.p
              className="mt-6 max-w-xl text-lg text-[var(--brand-light-purple)]/80 md:text-xl"
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
            >
              Every order lands as a surprise drop: authentic sports shirts from clubs
              and national teams around the world.
            </motion.p>

            <motion.div
              className="mt-10 flex flex-col gap-4 sm:flex-row"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.55 }}
            >
              <Link
                to="/order/size"
                className="rounded-none border border-red-500 bg-red-600 px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-red-700"
              >
                Order Now
              </Link>
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("how-it-works")
                    ?.scrollIntoView({ behavior: "smooth", block: "start" })
                }
                className="rounded-none border border-[var(--brand-light-purple)] px-8 py-4 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[var(--brand-light-purple)] transition-colors hover:bg-[var(--brand-light-purple)]/10"
              >
                How It Works
              </button>
            </motion.div>

            <motion.p
              className="mt-8 text-xs uppercase tracking-[0.2em] text-[var(--brand-light-purple)]/70"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.36, duration: 0.55 }}
            >
              New stock weekly. No repeats in the same order.
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 24, scale: 0.98 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ delay: 0.18, duration: 0.65 }}
            className="relative h-[360px] w-full sm:h-[460px] md:h-[560px]"
          >
            <motion.div
              className="absolute inset-0 bg-red-500/10"
              animate={{ opacity: [0.4, 0.7, 0.45] }}
              transition={{ duration: 7, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            />
            <div className="absolute inset-0 overflow-hidden [clip-path:polygon(8%_0,100%_0,92%_100%,0_100%)]">
              <img
                src="https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=900"
                alt="Mystery sports shirt showcase"
                className="h-full w-full object-cover saturate-125"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--brand-dark-azure)]/80 via-transparent to-transparent" />
            </div>

            <motion.div
              className="absolute -left-6 top-8 border border-red-300/50 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-red-100 backdrop-blur-sm md:-left-10"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              Limited Monthly Drop
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
