import type { Metadata } from "next";
import { brand, brandCssVars } from "@vantrow/brand";
import { PlatformNav, type NavAccount } from "@/components/platform-nav";
import { getSessionOrNull } from "@/lib/session";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`https://${brand.domain}`),
  title: {
    default: `${brand.name} Platform`,
    template: `%s | ${brand.name} Platform`,
  },
  description: `Operations platform for ${brand.name} — leads, estimates, e-sign, invoices, and payments in one job pipeline.`,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabaseMode = isSupabaseConfigured();
  // In Supabase mode, resolve who's signed in (null on public/auth pages) so the
  // nav can show their name/org + a sign-out. In demo mode the nav is unchanged.
  const session = supabaseMode ? await getSessionOrNull() : null;
  const account: NavAccount | null = session
    ? { name: session.user.name, orgName: session.org.name }
    : null;

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
              <PlatformNav supabaseMode={supabaseMode} account={account} />
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
