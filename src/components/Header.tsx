import Link from "next/link";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/80 bg-paper/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-display text-lg font-semibold text-ink">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-navy-deep text-[13px] font-bold text-gold">
            VR
          </span>
          VerbRea
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-ink-soft sm:flex">
          <Link href="/#what-we-measure" className="hover:text-ink">
            What we measure
          </Link>
          <Link href="/#how-it-works" className="hover:text-ink">
            How it works
          </Link>
          <Link href="/#pricing" className="hover:text-ink">
            Pricing
          </Link>
        </nav>
        <Link
          href="/start"
          className="inline-flex items-center justify-center rounded-full bg-navy-deep px-5 py-2.5 text-sm font-semibold text-on-navy hover:bg-navy transition-colors"
        >
          Start test
        </Link>
      </div>
    </header>
  );
}
