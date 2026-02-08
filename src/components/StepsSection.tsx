import { ClipboardList, Users, Heart } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    title: "Skriv dig op",
    description: "Det tager ca. 30 sekunder.",
  },
  {
    icon: Users,
    title: "Vælg rytter",
    description: "Vælg hvilken rytters indsamling støtten skal registreres på.",
  },
  {
    icon: Heart,
    title: "750 kr. til kampen",
    description:
      "Når du bliver kunde hos NRGi, støtter NRGi kampen mod sclerose med 750 kr.",
  },
];

const StepsSection = () => {
  return (
    <section className="bg-secondary px-4 py-16 md:py-24">
      <div className="mx-auto max-w-4xl">
        <h2 className="mb-12 text-center text-3xl text-foreground md:text-4xl">
          Sådan virker det
        </h2>

        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center"
            >
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <step.icon className="h-7 w-7" />
              </div>

              <span className="mb-1 text-sm font-semibold uppercase tracking-wide text-accent">
                Trin {index + 1}
              </span>

              <h3 className="mb-2 font-sans text-xl font-bold text-foreground">
                {step.title}
              </h3>

              <p className="text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StepsSection;
