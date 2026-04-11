import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Brush, Shirt } from "lucide-react";
import { useNavigate } from "react-router";

type OrderCategory = "jersey" | "artwork";

const CATEGORY_CONTENT: Record<
  OrderCategory,
  { title: string; subtitle: string; helper: string; cta: string }
> = {
  jersey: {
    title: "Football Jerseys",
    subtitle: "Mystery match-worn style shirts, curated to your taste.",
    helper: "Best for collectors and club fans.",
    cta: "Shop Jerseys",
  },
  artwork: {
    title: "Football Artworks",
    subtitle: "Curated football-inspired artwork drops with bold visual identity.",
    helper: "Best for walls, studios, and gifting.",
    cta: "Shop Artworks",
  },
};

export function OrderCategoryPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<OrderCategory>("jersey");

  const continueToFlow = () => {
    navigate(`/order/size?category=${selectedCategory}`);
  };

  return (
    <div className="min-h-screen overflow-x-hidden py-12">
      <div className="container mx-auto max-w-5xl px-4">
        <motion.section
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/65 p-6 md:p-8"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--brand-vivid-red)]">
            Order Type
          </p>
          <h1 className="mt-3 text-3xl font-black uppercase leading-[0.95] text-[var(--brand-light-purple)] md:text-5xl">
            Choose Your Football Drop
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-[var(--brand-light-purple)]/72 md:text-base">
            Start by selecting what you want to receive. You can continue with the
            same checkout flow after choosing your product type.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            <button
              type="button"
              onClick={() => setSelectedCategory("jersey")}
              className={`group relative overflow-hidden border p-5 text-left transition-all md:p-6 ${
                selectedCategory === "jersey"
                  ? "border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)]/12"
                  : "border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)]/45 hover:border-[var(--brand-light-purple)]/45"
              }`}
            >
              <img
                src="/assets/images/jersey.jpg"
                alt="Football jersey option"
                className="h-40 w-full object-cover md:h-44"
              />
              <div className="mt-4 flex items-center gap-2">
                <Shirt className="h-4 w-4 text-[var(--brand-vivid-red)]" />
                <h2 className="text-xl font-black uppercase text-[var(--brand-light-purple)]">
                  {CATEGORY_CONTENT.jersey.title}
                </h2>
              </div>
              <p className="mt-2 text-sm text-[var(--brand-light-purple)]/75">
                {CATEGORY_CONTENT.jersey.subtitle}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.08em] text-[var(--brand-light-purple)]/65">
                {CATEGORY_CONTENT.jersey.helper}
              </p>
            </button>

            <button
              type="button"
              onClick={() => setSelectedCategory("artwork")}
              className={`group relative overflow-hidden border p-5 text-left transition-all md:p-6 ${
                selectedCategory === "artwork"
                  ? "border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)]/12"
                  : "border-[var(--brand-light-purple)]/25 bg-[var(--brand-dark-azure)]/45 hover:border-[var(--brand-light-purple)]/45"
              }`}
            >
              <div className="relative h-40 w-full overflow-hidden bg-[var(--brand-dark-azure)] md:h-44">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(174,15,15,0.38),transparent_45%),radial-gradient(circle_at_82%_78%,rgba(245,244,248,0.2),transparent_46%),linear-gradient(135deg,#001114_0%,#082028_100%)]" />
                <div className="absolute inset-0 border border-[var(--brand-light-purple)]/20" />
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Brush className="h-4 w-4 text-[var(--brand-vivid-red)]" />
                <h2 className="text-xl font-black uppercase text-[var(--brand-light-purple)]">
                  {CATEGORY_CONTENT.artwork.title}
                </h2>
              </div>
              <p className="mt-2 text-sm text-[var(--brand-light-purple)]/75">
                {CATEGORY_CONTENT.artwork.subtitle}
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.08em] text-[var(--brand-light-purple)]/65">
                {CATEGORY_CONTENT.artwork.helper}
              </p>
            </button>
          </div>

          <div className="mt-8 border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)]/55 p-4 md:p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand-light-purple)]/65">
              Selected
            </p>
            <p className="mt-2 text-lg font-bold text-[var(--brand-light-purple)]">
              {CATEGORY_CONTENT[selectedCategory].title}
            </p>
            <button
              type="button"
              onClick={continueToFlow}
              className="mt-4 inline-flex min-h-11 items-center gap-2 border border-[var(--brand-vivid-red)] bg-[var(--brand-vivid-red)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.08em] text-white transition-colors hover:bg-[#c30f37]"
            >
              {CATEGORY_CONTENT[selectedCategory].cta}
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
