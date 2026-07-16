"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const LINKS = [
  { href: "/pipeline", label: "Pipeline" },
  { href: "/leads/new", label: "New Lead" },
];

export function PlatformNav() {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="flex items-center gap-1 sm:gap-2">
      {LINKS.map((link) => {
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
    </nav>
  );
}
