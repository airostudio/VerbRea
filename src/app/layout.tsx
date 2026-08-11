import type { Metadata } from "next";
import "@fontsource/inter/400.css";
import "@fontsource/inter/500.css";
import "@fontsource/inter/600.css";
import "@fontsource/inter/700.css";
import "@fontsource/fraunces/500.css";
import "@fontsource/fraunces/600.css";
import "@fontsource/fraunces/700.css";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://verbrea.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "VerbRea — Verbal Reasoning Mastery Test",
  description:
    "A GRE- and LSAT-calibre Verbal Reasoning Mastery test that measures how fast and accurately you process language, evaluate arguments, and extract logical conclusions. Get your full score report for $1.99.",
  openGraph: {
    title: "VerbRea — Verbal Reasoning Mastery Test",
    description:
      "Measure your cognitive efficiency with deductive reasoning, critical reasoning, reading comprehension, and verbal precision questions modeled on graduate and executive assessment standards.",
    images: ["/images/og-image.png"],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "VerbRea — Verbal Reasoning Mastery Test",
    description:
      "How fast and accurately does your brain process language and logic? Find out in 20 minutes.",
    images: ["/images/og-image.png"],
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-paper text-ink">{children}</body>
    </html>
  );
}
