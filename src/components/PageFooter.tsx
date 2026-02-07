const PageFooter = () => {
  return (
    <footer className="border-t border-border bg-secondary px-4 py-12">
      <div className="mx-auto max-w-4xl text-center">
        <p className="mb-8 text-sm text-muted-foreground">
          Et samarbejde mellem NRGi, Cykelnerven og Scleroseforeningen
        </p>

        <div className="flex items-center justify-center gap-8 md:gap-12">
          {/* Logo placeholders */}
          <div className="flex h-12 w-24 items-center justify-center rounded border border-border bg-background text-xs text-muted-foreground">
            NRGi
          </div>
          <div className="flex h-12 w-24 items-center justify-center rounded border border-border bg-background text-xs text-muted-foreground">
            Cykelnerven
          </div>
          <div className="flex h-12 w-24 items-center justify-center rounded border border-border bg-background text-xs text-muted-foreground">
            Sclerosefor.
          </div>
        </div>

        <p className="mt-8 text-xs text-muted-foreground/60">
          © {new Date().getFullYear()} NRGi × Cykelnerven
        </p>
      </div>
    </footer>
  );
};

export default PageFooter;
