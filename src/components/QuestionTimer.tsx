"use client";

interface Props {
  remainingSec: number;
  totalSec: number;
}

export function QuestionTimer({ remainingSec, totalSec }: Props) {
  const pct = Math.max(0, Math.min(100, (remainingSec / totalSec) * 100));
  const urgent = remainingSec <= 10;
  const critical = remainingSec <= 5;

  return (
    <div className="flex items-center gap-3">
      <div
        className={`font-display text-2xl font-semibold tabular-nums ${
          critical ? "text-danger" : urgent ? "text-gold-ink" : "text-ink"
        }`}
        aria-hidden="true"
      >
        {remainingSec}s
      </div>
      <div className="h-2 w-28 overflow-hidden rounded-full bg-line sm:w-40">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${
            critical ? "bg-danger" : urgent ? "bg-gold-ink" : "bg-navy-deep"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="sr-only" role="status" aria-live="polite">
        {remainingSec <= 10 ? `${remainingSec} seconds remaining` : ""}
      </span>
    </div>
  );
}
