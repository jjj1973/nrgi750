import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import RiderCombobox from "@/components/RiderCombobox";
import { riders } from "@/data/riders";
import { CheckCircle, Loader2 } from "lucide-react";

const formSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Navn skal være mindst 2 tegn")
    .max(100, "Navn må højst være 100 tegn"),
  address: z
    .string()
    .trim()
    .min(5, "Adresse skal være mindst 5 tegn")
    .max(200, "Adresse må højst være 200 tegn"),
  phone: z
    .string()
    .trim()
    .min(8, "Telefonnummer skal være mindst 8 cifre")
    .max(20, "Telefonnummer må højst være 20 tegn")
    .regex(/^[0-9+\-\s()]+$/, "Ugyldigt telefonnummer"),
  email: z
    .string()
    .trim()
    .email("Ugyldig e-mailadresse")
    .max(255, "E-mail må højst være 255 tegn"),
  riderId: z.string().min(1, "Vælg venligst en rytter"),
  consent: z.literal(true, {
    errorMap: () => ({ message: "Du skal acceptere for at fortsætte" }),
  }),
  // Honeypot field – must be empty
  website: z.string().max(0).optional(),
});

type FormData = z.infer<typeof formSchema>;

const SignupForm = () => {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedRider, setSelectedRider] = useState("");
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      riderId: "",
      consent: undefined,
      website: "",
    },
  });

  const onRiderChange = (riderId: string) => {
    setSelectedRider(riderId);
    setValue("riderId", riderId, { shouldValidate: true });
  };

  const onSubmit = async (data: FormData) => {
    // Honeypot check
    if (data.website && data.website.length > 0) {
      // Silently reject spam
      setSubmitted(true);
      return;
    }

    setSubmitting(true);

    const rider = riders.find((r) => r.id === data.riderId);

    try {
      const response = await fetch("/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          address: data.address,
          phone: data.phone,
          email: data.email,
          riderName: rider?.name ?? "Ukendt",
          consentTimestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Submission failed");
      }

      setSubmitted(true);
    } catch {
      toast({
        variant: "destructive",
        title: "Noget gik galt",
        description:
          "Vi kunne ikke sende din tilmelding. Prøv venligst igen.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <section id="tilmelding" className="px-4 py-16 md:py-24">
        <div className="mx-auto max-w-lg text-center">
          <CheckCircle className="mx-auto mb-6 h-16 w-16 text-primary" />
          <h2 className="mb-4 text-3xl text-foreground">Tak for din støtte!</h2>
          <p className="text-lg leading-relaxed text-muted-foreground">
            Din tilmelding er modtaget. NRGi kontakter dig hurtigst muligt – og
            du har nu støttet kampen for en verden uden sclerose.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section id="tilmelding" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl text-foreground md:text-4xl">
            Tilmeld dig
          </h2>
          <p className="text-muted-foreground">
            Det er gratis og uforpligtende at sige ja tak til et tilbud fra
            NRGi.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          {/* Honeypot – hidden from real users */}
          <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              {...register("website")}
            />
          </div>

          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Fulde navn</Label>
            <Input
              id="name"
              placeholder="Dit fulde navn"
              {...register("name")}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input
              id="address"
              placeholder="Gade, nr., postnr. og by"
              {...register("address")}
            />
            {errors.address && (
              <p className="text-sm text-destructive">
                {errors.address.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Telefon</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="Dit telefonnummer"
              {...register("phone")}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">
                {errors.phone.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="din@email.dk"
              {...register("email")}
            />
            {errors.email && (
              <p className="text-sm text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Rider selector */}
          <div className="space-y-2">
            <Label>Vælg den rytter, du vil støtte</Label>
            <RiderCombobox value={selectedRider} onChange={onRiderChange} />
            <p className="text-xs text-muted-foreground">
              750 kr. går til den valgte rytters indsamling, hvis du bliver
              NRGi-kunde.
            </p>
            {errors.riderId && (
              <p className="text-sm text-destructive">
                {errors.riderId.message}
              </p>
            )}
          </div>

          {/* Consent */}
          <div className="space-y-2">
            <div className="flex items-start gap-3">
              <Checkbox
                id="consent"
                onCheckedChange={(checked) =>
                  setValue("consent", checked === true ? true : undefined as any, {
                    shouldValidate: true,
                  })
                }
                className="mt-0.5"
              />
              <Label
                htmlFor="consent"
                className="text-sm font-normal leading-snug"
              >
                Jeg accepterer, at NRGi må kontakte mig pr. telefon og/eller
                e-mail med et energitilbud.
              </Label>
            </div>
            {errors.consent && (
              <p className="text-sm text-destructive">
                {errors.consent.message}
              </p>
            )}
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className="w-full bg-accent py-6 text-lg font-semibold text-accent-foreground shadow-md hover:bg-accent/90"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sender...
              </>
            ) : (
              "Send tilmelding"
            )}
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Dine oplysninger bruges kun til at kontakte dig og til at
            registrere, hvilken rytter du ønsker at støtte.
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
