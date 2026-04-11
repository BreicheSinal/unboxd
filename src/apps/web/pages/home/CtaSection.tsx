import { Link } from "react-router";
import { HomeSectionLayout } from "./HomeSectionLayout";

export function CtaSection() {
  return (
    <HomeSectionLayout className="bg-[var(--brand-dark-azure)]" inverted>
      <div className="mx-auto max-w-4xl rounded-2xl bg-gradient-to-br from-red-600 to-red-800 p-12 text-center text-white">
        <h2 className="mb-4 text-3xl font-bold md:text-5xl">
          Ready for Your Mystery?
        </h2>
        <p className="mb-8 text-xl opacity-90">
          Start your collection today and join the excitement
        </p>
        <Link
          to="/order"
          className="inline-block rounded-lg bg-white px-8 py-4 font-bold text-red-600 transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          Order Your Mystery Shirt
        </Link>
      </div>
    </HomeSectionLayout>
  );
}
