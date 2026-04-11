import { Star } from "lucide-react";
import { motion } from "motion/react";
import { HomeSectionLayout } from "./HomeSectionLayout";
import { homeSectionTheme } from "./homeSectionTheme";

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

export function TestimonialsSection() {
  return (
    <HomeSectionLayout
      id="what-customers-say"
      title="What Our Customers Say"
      subtitle="Join thousands of satisfied mystery shirt collectors"
      className="bg-[var(--brand-light-purple)]"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            viewport={{ once: true }}
            className={`${homeSectionTheme.panelClass} h-full min-h-[240px] p-6`}
          >
            <div className="mb-4 flex items-center gap-4">
              <img
                src={testimonial.image}
                alt={testimonial.name}
                className="h-12 w-12 rounded-full object-cover"
              />
              <div>
                <h4 className="font-bold">{testimonial.name}</h4>
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star
                      key={`${testimonial.name}-rating-${i}`}
                      className="h-4 w-4 fill-yellow-500 text-yellow-500"
                    />
                  ))}
                </div>
              </div>
            </div>
            <p className="opacity-80">{testimonial.text}</p>
          </motion.div>
        ))}
      </div>
    </HomeSectionLayout>
  );
}
