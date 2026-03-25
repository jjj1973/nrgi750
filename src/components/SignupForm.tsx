import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import RiderCombobox from "@/components/RiderCombobox";
import { Info, Mail } from "lucide-react";
import { riders } from "@/data/riders";

const formSchema = z.object({
  name: z.string().trim().min(2, "Udfyld dit navn").max(100, "Navn må højst være 100 tegn"),
  address: z.string().trim().min(5, "Udfyld din adresse").max(200, "Adresse må højst være 200 tegn"),
  phone: z.string().trim().regex(/^[\d\s]{8,12}$/, "Indtast et gyldigt mobilnummer"),
  email: z.string().trim().email("Indtast en gyldig e-mail").max(255, "E-mail må højst være 255 tegn"),
  riderId: z.string().min(1, "Vælg en rytter"),
});

type FormData = z.infer<typeof formSchema>;

const SignupForm = () => {
  const [selectedRider, setSelectedRider] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onTouched",
    defaultValues: {
      name: "",
      address: "",
      phone: "",
      email: "",
      riderId: "",
    },
  });

  const onRiderChange = (riderId: string) => {
    setSelectedRider(riderId);
    setValue("riderId", riderId, { shouldValidate: true });
  };

  const onSubmit = (data: FormData) => {
    const riderName = riders.find((r) => r.id === data.riderId)?.name ?? "";

    const body = `Hej NRGi

Jeg ønsker at blive kontaktet med et godt NRGi-tilbud på strøm.
Jeg accepterer, at NRGi må kontakte mig pr. telefon og/eller e-mail med et NRGi-tilbud.

Her er mine kontaktoplysninger:
Navn: ${data.name}
Adresse: ${data.address}
Mobilnummer: ${data.phone}
E-mail: ${data.email}

Jeg ønsker at følgende rytter får de 750 kr. registreret på sin indsamling:
${riderName}

Vi tales eller skrives ved.

Med venlig hilsen
${data.name}`;

    const subject = "Tilmelding – Cykelnerven x NRGi";
    const mailto = `mailto:cykelnerven@nrgi.dk?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  };

  return (
    <section id="tilmelding" className="px-4 py-16 md:py-24">
      <div className="mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <h2 className="mb-3 text-3xl text-foreground md:text-4xl">
            Tilmeld dig
          </h2>
          <p className="text-muted-foreground">
            Gratis og uforpligtende. NRGi's kundeservice kontakter dig – trygt
            og i øjenhøjde.
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5 rounded-xl border border-border bg-card p-6 shadow-sm md:p-8"
        >
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Fulde navn</Label>
            <Input id="name" placeholder="Dit fulde navn" {...register("name")} />
            {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">Adresse</Label>
            <Input id="address" placeholder="Gade, nr., postnr. og by" {...register("address")} />
            {errors.address && <p className="text-sm text-destructive">{errors.address.message}</p>}
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone">Mobilnummer</Label>
            <Input id="phone" type="tel" placeholder="Dit mobilnummer" {...register("phone")} />
            {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" placeholder="din@email.dk" {...register("email")} />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          {/* Rider selector */}
          <div className="space-y-2">
            <Label>Vælg rytter (hvor støtten registreres)</Label>
            <RiderCombobox value={selectedRider} onChange={onRiderChange} />
            <p className="text-xs text-muted-foreground">
              Støtten går til kampen mod sclerose. Dit valg bestemmer, hvilken
              rytters Cykelnerven-indsamling den registreres hos.
            </p>
            {errors.riderId && <p className="text-sm text-destructive">{errors.riderId.message}</p>}
          </div>

          {/* Info note */}
          <div className="flex items-center gap-2 rounded-md bg-muted p-3 text-sm text-muted-foreground">
            <Info className="h-4 w-4 shrink-0" />
            <span>Bemærk: Siden sender ikke data. Når du trykker, åbner din mailapp med udfyldt tekst – og du sender selv.</span>
          </div>

          <Button
            type="submit"
            disabled={!isValid}
            className="w-full bg-accent py-6 text-lg font-semibold text-accent-foreground shadow-md hover:bg-accent/90 disabled:opacity-50"
          >
            <Mail className="mr-2 h-5 w-5" />
            Åbn mail – send tilmelding
          </Button>

          <p className="text-center text-xs text-muted-foreground">
            Dine oplysninger bruges kun til at udfylde mailen – intet gemmes.
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignupForm;
