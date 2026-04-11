import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { PreviewSection } from "./PreviewSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaSection } from "./CtaSection";

export function HomePageSections() {
  return (
    <div className="overflow-hidden">
      <HeroSection />
      <HowItWorksSection />
      <PreviewSection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}

