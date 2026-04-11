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
      <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-rose-500/15 to-zinc-400/10 dark:from-red-700/12 dark:via-rose-600/10 dark:to-zinc-500/8"></div>
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1765130729127-f734df4dff3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmYW4lMjBzdGFkaXVtJTIwY3Jvd2R8ZW58MXx8fHwxNzc0NDQ2NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-5"></div>

      <div className={homeSectionTheme.containerClass}>
        <motion.div
          className={`${homeSectionTheme.innerClass} py-20 text-center`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-accent/50 px-4 py-2 backdrop-blur-sm">
            <span className="text-sm">The Ultimate Sports Shirt Mystery Box</span>
          </div>

          <h1 className="mb-6 bg-gradient-to-r from-red-300 via-rose-400 to-red-600 bg-clip-text text-5xl font-bold text-transparent md:text-7xl">
            Get Your Mystery Shirt
          </h1>

          <p className="mx-auto mb-8 max-w-3xl text-xl text-[var(--brand-light-purple)] opacity-80 md:text-2xl">
            Every order is a surprise. Discover authentic sports shirts from teams
            around the world.
          </p>

          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <Link
              to="/order"
              className="rounded-lg bg-gradient-to-r from-rose-500 to-red-700 px-8 py-4 text-white transition-all duration-300 hover:scale-105 hover:shadow-lg"
            >
              Order Now
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg bg-accent px-8 py-4 text-accent-foreground transition-colors hover:bg-accent/80"
            >
              How It Works
            </a>
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
