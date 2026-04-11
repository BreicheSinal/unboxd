import { Star } from "lucide-react";
import { motion } from "motion/react";
import { HomeSectionLayout } from "./HomeSectionLayout";
import type { HomeSectionTone } from "./HomeSectionLayout";

const testimonials = [
  {
    name: "Alex Rodriguez",
    image:
      "https://images.unsplash.com/photo-1753161023792-d240af5e6ef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3NDQ3MjAyN3ww&ixlib=rb-4.1.0&q=80&w=400",
    text: "Got an amazing vintage Bayern Munich shirt! The surprise element makes it so exciting.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    image:
      "https://images.unsplash.com/photo-1753161023792-d240af5e6ef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3NDQ3MjAyN3ww&ixlib=rb-4.1.0&q=80&w=400",
    text: "I've ordered 5 times and each shirt has been incredible. The trading feature is genius!",
    rating: 5,
  },
  {
    name: "Marcus Johnson",
    image:
      "https://images.unsplash.com/photo-1753161023792-d240af5e6ef7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxoYXBweSUyMGN1c3RvbWVyJTIwcG9ydHJhaXQlMjBzbWlsaW5nfGVufDF8fHx8MTc3NDQ3MjAyN3ww&ixlib=rb-4.1.0&q=80&w=400",
    text: "Best sports merchandise experience ever. Quality shirts and great customer service.",
    rating: 5,
  },
];

type TestimonialsSectionProps = {
  tone?: HomeSectionTone;
};

export function TestimonialsSection({ tone = "dark" }: TestimonialsSectionProps) {
  const sectionClass =
    tone === "dark"
      ? "border border-[var(--brand-light-purple)]/20 bg-[var(--brand-dark-azure)] text-[var(--brand-light-purple)]"
      : "border border-[var(--brand-dark-azure)]/20 bg-[var(--brand-light-purple)] text-[var(--brand-dark-azure)]";
  const rowBorderClass =
    tone === "dark"
      ? "border-[var(--brand-light-purple)]/15"
      : "border-[var(--brand-dark-azure)]/20";
  const avatarBorderClass =
    tone === "dark"
      ? "border-[var(--brand-light-purple)]/25"
      : "border-[var(--brand-dark-azure)]/25";

  return (
    <HomeSectionLayout
      id="what-customers-say"
      title="Collector Feedback"
      subtitle="What repeat buyers say after opening their drops."
      tone={tone}
    >
      <div className={`mx-auto w-full max-w-6xl ${sectionClass}`}>
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.12 }}
            viewport={{ once: true }}
            className={`grid grid-cols-[1fr_auto] gap-6 border-b p-6 last:border-b-0 md:grid-cols-[220px_1fr_auto] md:items-center md:p-8 ${rowBorderClass}`}
          >
            <div className="flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className={`h-14 w-14 border object-cover ${avatarBorderClass}`}
              />
              <h4 className="text-base font-bold uppercase tracking-[0.08em]">
                {testimonial.name}
              </h4>
            </div>
            <p className="col-span-2 text-base leading-relaxed opacity-85 md:col-span-1 md:text-lg">
              {testimonial.text}
            </p>
            <div className="col-span-2 flex gap-1 md:col-span-1 md:justify-end">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star
                  key={`${testimonial.name}-rating-${i}`}
                  className="h-4 w-4 fill-yellow-500 text-yellow-500"
                />
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </HomeSectionLayout>
  );
}
