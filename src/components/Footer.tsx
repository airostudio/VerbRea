import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-navy-line bg-navy-deep text-on-navy-soft">
      <div className="container-page flex flex-col gap-6 py-12 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex items-center gap-2 font-display text-lg font-semibold text-on-navy">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-gold/50 text-[13px] font-bold text-gold">
              VR
            </span>
            VerbRea
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed">
            Executive-calibre verbal reasoning assessment, modeled on the format and
            standards of graduate and professional aptitude testing.
          </p>
        </div>
        <div className="flex gap-12 text-sm">
          <div>
            <div className="mb-3 font-semibold text-on-navy">Assessment</div>
            <ul className="space-y-2">
              <li>
                <Link href="/start" className="hover:text-gold-soft">
                  Start the test
                </Link>
              </li>
              <li>
                <Link href="/#what-we-measure" className="hover:text-gold-soft">
                  What we measure
                </Link>
              </li>
              <li>
                <Link href="/#pricing" className="hover:text-gold-soft">
                  Pricing
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <div className="mb-3 font-semibold text-on-navy">Legal</div>
            <ul className="space-y-2">
              <li>
                <Link href="/privacy" className="hover:text-gold-soft">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-gold-soft">
                  Terms
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-navy-line/60 py-5 text-center text-xs text-on-navy-soft/80">
        © {new Date().getFullYear()} VerbRea. Not affiliated with or endorsed by ETS, LSAC, SHL, or Korn Ferry.
      </div>
    </footer>
  );
}
