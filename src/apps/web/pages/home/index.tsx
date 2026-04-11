import { HeroSection } from "./HeroSection";
import { HowItWorksSection } from "./HowItWorksSection";
import { WhyChooseSection } from "./WhyChooseSection";
import { PreviewSection } from "./PreviewSection";
import { TestimonialsSection } from "./TestimonialsSection";
import { CtaSection } from "./CtaSection";
import type { HomeSectionTone } from "./HomeSectionLayout";

export function HomePageSections() {
  const contentSections = [
    HowItWorksSection,
    WhyChooseSection,
    PreviewSection,
    TestimonialsSection,
  ];
  const ctaTone: HomeSectionTone =
    contentSections.length % 2 === 0 ? "light" : "dark";

  return (
    <div className="overflow-hidden">
      <HeroSection />
      {contentSections.map((Section, index) => {
        const tone: HomeSectionTone = index % 2 === 0 ? "light" : "dark";

        return <Section key={Section.name} tone={tone} />;
      })}
      <CtaSection tone={ctaTone} />
    </div>
  );
}
