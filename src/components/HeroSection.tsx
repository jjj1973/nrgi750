import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

const HeroSection = () => {
  const scrollToForm = () => {
    document.getElementById("tilmelding")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-primary px-4 py-20 md:py-32">
      {/* Subtle decorative circle */}
      <div className="absolute -right-20 -top-20 h-80 w-80 rounded-full bg-accent/10" />
      <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-accent/5" />

      <div className="relative mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-primary-foreground/10 px-4 py-2 text-sm text-primary-foreground/80">
          <Heart className="h-4 w-4 fill-accent text-accent" />
          <span>NRGi × Cykelnerven</span>
        </div>

        <h1 className="mb-6 text-4xl leading-tight text-primary-foreground md:text-6xl md:leading-tight">
          Vi cykler for en verden uden sclerose
        </h1>

        <p className="mx-auto mb-4 max-w-xl text-lg leading-relaxed text-primary-foreground/85 md:text-xl">
          Når du siger ja tak til et energitilbud fra NRGi – og bliver kunde –
          støtter NRGi kampen mod sclerose med <strong className="text-accent">750 kr.</strong>
        </p>

        <p className="mx-auto mb-10 max-w-xl text-base leading-relaxed text-primary-foreground/70">
          Du vælger selv, hvilken Cykelnerven-rytter støtten skal registreres hos.
        </p>

        <Button
          onClick={scrollToForm}
          size="lg"
          className="bg-accent px-8 py-6 text-lg font-semibold text-accent-foreground shadow-lg transition-transform hover:scale-105 hover:bg-accent/90"
        >
          Støt kampen mod sclerose
        </Button>

        <p className="mt-4 text-sm text-primary-foreground/60">
          Du får en venlig samtale – helt uden pres.
        </p>
      </div>
    </section>
  );
};

export default HeroSection;
