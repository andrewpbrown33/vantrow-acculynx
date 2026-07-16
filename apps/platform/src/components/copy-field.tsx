"use client";

import { useState, useSyncExternalStore } from "react";

// Read the current origin on the client without a setState-in-effect: the
// server snapshot is empty and the client snapshot is window.location.origin,
// so hydration matches and the absolute URL fills in after mount.
function subscribe(): () => void {
  return () => {};
}
function getClientOrigin(): string {
  return window.location.origin;
}
function getServerOrigin(): string {
  return "";
}

/**
 * Read-only field showing a public path as an absolute URL (resolved on the
 * client so it matches whatever host the app is served from) with a copy button.
 */
export function CopyField({ path, label }: { path: string; label?: string }) {
  const origin = useSyncExternalStore(subscribe, getClientOrigin, getServerOrigin);
  const [copied, setCopied] = useState(false);

  const value = origin ? `${origin}${path}` : path;

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div>
      {label && (
        <span className="mb-1 block text-sm font-medium text-foreground">
          {label}
        </span>
      )}
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          type="text"
          readOnly
          value={value}
          aria-label={label ?? "Shareable link"}
          onFocus={(e) => e.currentTarget.select()}
          className="w-full rounded-md border border-foreground/20 bg-white px-3 py-2 font-mono text-xs text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="button"
          onClick={copy}
          className="shrink-0 rounded-md border border-brand bg-white px-4 py-2 text-sm font-semibold text-brand transition-colors hover:bg-brand hover:text-white"
        >
          {copied ? "Copied" : "Copy link"}
        </button>
      </div>
    </div>
  );
}
