"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-actions";

const LINKS = [
  { href: "/pipeline", label: "Pipeline" },
  { href: "/contacts", label: "Contacts" },
  { href: "/leads/new", label: "New Lead" },
];

export interface NavAccount {
  name: string;
  orgName: string;
}

/**
 * Primary nav.
 *
 * - Demo mode (`supabaseMode=false`): the original links, no account/sign-out.
 * - Supabase mode, signed in (`account` set): links + the signed-in user's
 *   name/org + a Sign out control.
 * - Supabase mode, signed out (login/signup/public pages): no links.
 */
export function PlatformNav({
  supabaseMode = false,
  account = null,
}: {
  supabaseMode?: boolean;
  account?: NavAccount | null;
}) {
  const pathname = usePathname();
  const showLinks = !supabaseMode || account !== null;

  return (
    <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
      {showLinks &&
        LINKS.map((link) => {
          const active =
            pathname === link.href || pathname.startsWith(`${link.href}/`);
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              className={
                active
                  ? "rounded-md bg-brand px-3 py-2 text-sm font-semibold text-white"
                  : "rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
              }
            >
              {link.label}
            </Link>
          );
        })}

      {supabaseMode && account && (
        <div className="ml-2 flex items-center gap-3 border-l border-foreground/10 pl-3">
          <span className="hidden text-right leading-tight sm:block">
            <span className="block text-sm font-medium text-foreground">
              {account.name || "Account"}
            </span>
            <span className="block text-xs text-muted">{account.orgName}</span>
          </span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted transition-colors hover:bg-foreground/5 hover:text-foreground"
            >
              Sign out
            </button>
          </form>
        </div>
      )}
    </nav>
  );
}
