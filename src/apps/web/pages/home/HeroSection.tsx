import { Link } from "react-router";
import { motion } from "motion/react";
import { homeSectionTheme } from "./homeSectionTheme";

export function HeroSection() {
  return (
    <motion.section
      className="relative flex min-h-[90vh] items-center bg-[var(--brand-dark-azure)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className={`${homeSectionTheme.containerClass} relative z-10`}>
        <motion.div
          className={`${homeSectionTheme.innerClass} grid items-center gap-12 py-20 md:grid-cols-2`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-red-600/25 px-4 py-2 backdrop-blur-sm">
              <span className="text-sm">The Ultimate Sports Shirt Mystery Box</span>
            </div>

            <h1 className="mb-1 pb-2 leading-[1.2] bg-gradient-to-r from-red-300 via-rose-400 to-red-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl md:leading-[1.15]">
              Get Your Mystery Shirt
            </h1>

            <p className="mb-8 max-w-2xl text-xl text-[var(--brand-light-purple)] opacity-80 md:text-2xl">
              Every order is a surprise. Discover authentic sports shirts from teams
              around the world.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row">
              <Link
                to="/order/size"
                className="rounded-lg bg-gradient-to-r from-rose-500 to-red-700 px-8 py-4 text-center text-white transition-colors hover:from-rose-600 hover:to-red-800"
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
                className="rounded-lg border border-[var(--brand-light-purple)] bg-accent px-8 py-4 text-center text-accent-foreground transition-colors hover:bg-accent/80"
              >
                How It Works
              </button>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="relative"
          >
            <img
              src="https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=900"
              alt="Mystery sports shirt showcase"
              className="h-[420px] w-full rounded-3xl border border-white/10 object-cover shadow-sm md:h-[520px]"
            />
          </motion.div>
        </motion.div>
      </div>
    </motion.section>
  );
}
