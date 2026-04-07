import { Link } from "react-router";
import { Sparkles, ShoppingCart, Package, Gift, Star } from "lucide-react";
import { motion } from "motion/react";

export function HomePage() {
  const steps = [
    {
      icon: ShoppingCart,
      title: "Choose Size",
      description: "Select your preferred shirt size",
    },
    {
      icon: Package,
      title: "Set Exclusions",
      description: "Avoid specific teams, leagues, or colors",
    },
    {
      icon: Gift,
      title: "Receive Shirt",
      description: "Get your mystery shirt delivered!",
    },
  ];

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

  const previewShirts = [
    "https://images.unsplash.com/photo-1761751843922-edb2b2c3fd7f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjBqZXJzZXklMjBzcG9ydHMlMjBzaGlydHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1773355579207-4bc7a0915e74?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsJTIwamVyc2V5JTIwc3BvcnRzJTIwYXBwYXJlbHxlbnwxfHx8fDE3NzQ0NzIwMjV8MA&ixlib=rb-4.1.0&q=80&w=400",
    "https://images.unsplash.com/photo-1764116679127-dc9d2c1138a7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGplcnNleSUyMGF0aGxldGljJTIwd2VhcnxlbnwxfHx8fDE3NzQ0NzIwMjZ8MA&ixlib=rb-4.1.0&q=80&w=400",
  ];

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <motion.section
        className="relative min-h-[90vh] flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 via-rose-500/15 to-zinc-400/10 dark:from-red-700/12 dark:via-rose-600/10 dark:to-zinc-500/8"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1765130729127-f734df4dff3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcG9ydHMlMjBmYW4lMjBzdGFkaXVtJTIwY3Jvd2R8ZW58MXx8fHwxNzc0NDQ2NTgyfDA&ixlib=rb-4.1.0&q=80&w=1080')] bg-cover bg-center opacity-5"></div>

        <div className="container relative mx-auto px-4 py-20 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/50 backdrop-blur-sm mb-6">
              <span className="text-sm">
                The Ultimate Sports Shirt Mystery Box
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-red-300 via-rose-400 to-red-600 bg-clip-text text-transparent">
              Get Your Mystery Shirt
            </h1>

            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Every order is a surprise. Discover authentic sports shirts from
              teams around the world.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/order"
                className="px-8 py-4 bg-gradient-to-r from-rose-500 to-red-700 text-white rounded-lg hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Order Now
              </Link>
              <a
                href="#how-it-works"
                className="px-8 py-4 bg-accent text-accent-foreground rounded-lg hover:bg-accent/80 transition-colors"
              >
                How It Works
              </a>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how-it-works"
        className="py-20 bg-accent/30 scroll-mt-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Get your mystery shirt in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="bg-card border border-border rounded-xl p-8 text-center hover:shadow-lg transition-shadow">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rose-500 to-red-700 text-white mb-4">
                      <Icon className="h-8 w-8" />
                    </div>
                    <div className="absolute -top-4 -left-4 w-8 h-8 rounded-full bg-red-600 text-white flex items-center justify-center font-bold">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* Preview Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              You Might Get...
            </h2>
            <p className="text-muted-foreground text-lg">
              These are just a glimpse of the incredible shirts in our
              collection
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {previewShirts.map((shirt, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="relative group"
              >
                <div className="aspect-square rounded-xl overflow-hidden bg-card border border-border">
                  <img
                    src={shirt}
                    alt={`Mystery shirt preview ${index + 1}`}
                    className="w-full h-full object-cover blur-sm group-hover:blur-none transition-all duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                    <span className="text-white font-bold">
                      Mystery Awaits...
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="py-20 bg-accent/30"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied mystery shirt collectors
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-4 mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-bold">{testimonial.name}</h4>
                    <div className="flex gap-1">
                      {Array.from({ length: testimonial.rating }).map(
                        (_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-yellow-500 text-yellow-500"
                          />
                        ),
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground">{testimonial.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        className="py-20"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true, amount: 0.15 }}
      >
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-12 text-white">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready for Your Mystery?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Start your collection today and join the excitement
            </p>
            <Link
              to="/order"
              className="inline-block px-8 py-4 bg-white text-red-600 rounded-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-bold"
            >
              Order Your Mystery Shirt
            </Link>
          </div>
        </div>
      </motion.section>
    </div>
  );
}


