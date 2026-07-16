"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { sendEstimate } from "@/lib/actions";

/**
 * Button that sends a draft estimate for signature, then refreshes so the page
 * re-renders with the sent status + copyable public signing link.
 */
export function SendEstimate({ estimateId }: { estimateId: string }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onSend() {
    setError(null);
    startTransition(async () => {
      try {
        await sendEstimate(estimateId);
        router.refresh();
      } catch {
        setError("Something went wrong sending this estimate. Please try again.");
      }
    });
  }

  return (
    <div>
      <button
        type="button"
        onClick={onSend}
        disabled={pending}
        className="rounded-md bg-brand px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Sending…" : "Send for signature"}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  );
}
