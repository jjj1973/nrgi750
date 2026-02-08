import nrgiLogo from "@/assets/nrgi-logo.png";
import cykelnervenLogo from "@/assets/cykelnerven-logo.svg";

const PageFooter = () => {
  return (
    <footer className="bg-primary px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-8 text-sm text-primary-foreground/70">
          Et samarbejde mellem NRGi, Cykelnerven og Scleroseforeningen
        </p>

        <div className="flex flex-col items-center justify-center gap-8 sm:flex-row sm:gap-12">
          <img
            src={nrgiLogo}
            alt="NRGi"
            className="h-10 w-auto md:h-12"
          />
          <img
            src={cykelnervenLogo}
            alt="Cykelnerven og Scleroseforeningen"
            className="h-12 w-auto md:h-14"
          />
        </div>

        <p className="mt-8 text-xs text-primary-foreground/40">
          © {new Date().getFullYear()} NRGi × Cykelnerven
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
