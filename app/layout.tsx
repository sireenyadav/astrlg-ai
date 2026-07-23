import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Astrlg AI - Vastu Intelligence",
  description: "The ultimate architectural compliance and Vastu risk-assessment engine.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background">{children}</body>
    </html>
  );
}
