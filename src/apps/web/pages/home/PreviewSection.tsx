import { motion } from "motion/react";
import { HomeSectionLayout } from "./HomeSectionLayout";
import { homeSectionTheme } from "./homeSectionTheme";

const previewShirts = [
  "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
  "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
];

export function PreviewSection() {
  return (
    <HomeSectionLayout
      id="you-might-get"
      title="You Might Get..."
      subtitle="These are just a glimpse of the incredible shirts in our collection"
      className="bg-[var(--brand-dark-azure)]"
      inverted
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-8 md:grid-cols-3">
        {previewShirts.map((shirt, index) => (
          <motion.div
            key={`${shirt}-${index}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            viewport={{ once: true }}
            className="group relative h-full"
          >
            <div className={`${homeSectionTheme.panelClass} aspect-square overflow-hidden`}>
              <img
                src={shirt}
                alt={`Mystery shirt preview ${index + 1}`}
                className="h-full w-full object-cover blur-sm transition-all duration-300 group-hover:blur-none"
              />
              <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-6 opacity-0 transition-opacity group-hover:opacity-100">
                <span className="font-bold text-white">Mystery Awaits...</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </HomeSectionLayout>
  );
}
