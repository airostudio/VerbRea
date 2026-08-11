import type { Metadata } from "next";
import { Header } from "@/components/Header";
import { TestRunner } from "@/components/TestRunner";

export const metadata: Metadata = {
  title: "Verbal Reasoning Mastery test — VerbRea",
  robots: { index: false },
};

export default function TestPage() {
  return (
    <>
      <Header />
      <main className="flex-1 bg-paper">
        <TestRunner />
      </main>
    </>
  );
}
