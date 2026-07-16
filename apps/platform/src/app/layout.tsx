import type { Metadata } from "next";
import { brand, brandCssVars } from "@vantrow/brand";
import { PlatformNav } from "@/components/platform-nav";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: `${brand.name} Platform`,
    template: `%s | ${brand.name} Platform`,
  },
  description: `Operations platform for ${brand.name} — leads, estimates, e-sign, invoices, and payments in one job pipeline.`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Brand color tokens — single injection point for the whole app. */}
        <style dangerouslySetInnerHTML={{ __html: brandCssVars(brand) }} />
      </head>
      <body className="min-h-screen antialiased">
        <div className="flex min-h-screen flex-col">
          <header className="sticky top-0 z-40 border-b border-foreground/10 bg-background/90 backdrop-blur">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-4 sm:px-6">
              <div className="flex items-baseline gap-2">
                <span className="text-lg font-bold tracking-tight text-brand-dark">
                  {brand.name}
                </span>
                <span className="hidden text-xs text-muted sm:inline">
                  {brand.endorsement}
                </span>
              </div>
              <PlatformNav />
            </div>
          </header>
          <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8 sm:px-6">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
