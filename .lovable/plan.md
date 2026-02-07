

# NRGi x Cykelnerven – Landing Page

## Kampagneside: "Vi cykler for en verden uden sclerose"

En enkel, mobilvenlig one-page landingsside der samler støtte til Cykelnerven ved at forbinde besøgende med NRGi's energitilbud.

---

### 🎨 Design & Farvepalette

Merget brand-identitet inspireret af NRGi og Cykelnerven:
- **Primær farve**: Mørk grøn/teal fra NRGi (troværdighed, energi)
- **Accent farve**: Varm orange fra Cykelnerven/Scleroseforeningen (passion, formål)
- **Baggrund**: Hvid med masser af luft
- **Tekst**: Mørk, letlæselig typografi i stor størrelse
- **Stil**: Ren, rolig, no-nonsense – mobiloptimeret

---

### 📄 Sidestruktur (ét sammenhængende flow)

**1. Hero-sektion**
- Stor, klar overskrift: *"Vi cykler for en verden uden sclerose"*
- Kort forklaring om at NRGi donerer 750 kr. per ny kunde til den valgte rytters indsamling
- Tydelig CTA-knap der scroller ned til formularen

**2. Formålsafsnit**
- 2-3 linjer om Cykelnerven og Scleroseforeningen
- Kort og emotionelt – ingen overflødig tekst

**3. Sådan virker det (3 trin)**
- Tre simple ikoner/trin der forklarer flowet:
  1. Skriv dig op (30 sek.)
  2. Vælg den rytter du vil støtte
  3. Hvis du bliver NRGi-kunde, går 750 kr. til rytterens indsamling

**4. Tilmeldingsformular (kernefunktionen)**
- Kort intro-tekst om at det er gratis og uforpligtende
- Felter: Fulde navn, Adresse, Telefon, Email
- Søgbart rytter-dropdown (med placeholder-data til start – klar til CSV-data senere)
- Påkrævet samtykke-checkbox med tekst om NRGi-kontakt
- Privatlivsnote under formularen
- Honeypot-felt (skjult) til spam-beskyttelse

**5. Bekræftelsesvisning**
- Efter indsendelse: Tak-besked med bekræftelse af støtte til kampen mod sclerose
- Formularen skjules og erstattes af bekræftelsen

**6. Footer**
- Samarbejdslinje mellem NRGi, Cykelnerven og Scleroseforeningen
- Tre logo-pladsholdere

---

### ⚙️ Backend: Email-afsendelse

- **Lovable Cloud** med en serverless edge function
- **Resend** som email-tjeneste (kræver gratis konto + API-nøgle)
- Formularen sender data til edge function → email til cykelnerven@nrgi.dk
- Email indeholder: Navn, adresse, telefon, email, valgt rytter, samtykke + tidsstempel
- Server-side validering af alle felter
- Grundlæggende rate limiting i edge function

*Du skal oprette en gratis konto på resend.com og verificere dit domæne – jeg guider dig igennem det.*

---

### 🔒 Sikkerhed & Kvalitet

- Server-side validering (Zod-schema)
- Honeypot-felt mod spam
- Rate limiting i edge function
- Ingen klient-side hemmeligheder
- Hurtig indlæsning (minimal kode, ingen tunge biblioteker)

---

### 📱 Responsivt Design

- Mobile-first tilgang
- Stor, læsbar typografi på alle skærmstørrelser
- Formularen er let at udfylde på telefon
- Touch-venligt søgbart dropdown

