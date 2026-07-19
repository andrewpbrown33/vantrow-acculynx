"use client";

import { useState, useTransition } from "react";
import { ensurePortalLink } from "@/lib/actions";

/**
 * Contractor control: reveal (generating on first use) the persistent homeowner
 * portal link for a job, and copy it to share. The URL is built from the
 * platform origin the contractor is already on.
 */
export function SharePortalLink({ jobId }: { jobId: string }) {
  const [url, setUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();

  function reveal() {
    setError(false);
    startTransition(async () => {
      try {
        const { path } = await ensurePortalLink(jobId);
        setUrl(`${window.location.origin}${path}`);
      } catch {
        setError(true);
      }
    });
  }

  async function copy() {
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable — the field is selectable as a fallback */
    }
  }

  return (
    <div className="mt-3">
      <p className="text-xs text-muted">
        A live status page your customer can open anytime &mdash; no login.
      </p>
      {url ? (
        <div className="mt-2 space-y-2">
          <input
            readOnly
            value={url}
            onFocus={(e) => e.currentTarget.select()}
            className="w-full rounded-md border border-foreground/20 bg-foreground/[0.02] px-2.5 py-1.5 text-xs text-foreground focus:border-brand focus:outline-none"
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={copy}
              className="rounded-md bg-brand px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-brand-dark"
            >
              {copied ? "Copied!" : "Copy link"}
            </button>
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-medium text-brand hover:text-brand-dark"
            >
              Open
            </a>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={reveal}
          disabled={pending}
          className="mt-2 rounded-md border border-brand/40 px-3 py-1.5 text-xs font-semibold text-brand transition-colors hover:bg-brand/5 disabled:opacity-60"
        >
          {pending ? "Preparing…" : "Share with homeowner"}
        </button>
      )}
      {error && (
        <p className="mt-2 text-xs text-rose-700">
          Couldn&rsquo;t prepare the link. Please try again.
        </p>
      )}
    </div>
  );
}
