import type { Metadata } from "next";
import { Suspense } from "react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ResultsView } from "@/components/ResultsView";

export const metadata: Metadata = {
  title: "Your results — VerbRea",
  robots: { index: false },
};

export default function ResultsPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <Suspense
          fallback={
            <div className="flex min-h-[60vh] items-center justify-center">
              <p className="text-ink-soft">Scoring your test…</p>
            </div>
          }
        >
          <ResultsView />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
