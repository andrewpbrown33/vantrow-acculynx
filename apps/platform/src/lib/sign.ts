/**
 * Public e-sign guards (review finding #5). Pure helpers shared by the
 * `signEstimate` server action and the `/sign/[token]` page so the token TTL
 * and signature validation stay in one place. No side effects — safe to import
 * from both a "use server" module and a server component.
 */

/** A signing link is good for 30 days after the estimate was sent. */
export const SIGN_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;

/**
 * True when a sent estimate's signing link has aged past the TTL. A missing or
 * unparseable `sentAt` (anomalous — a token should always have one) is treated
 * as NOT expired, so we never falsely lock a homeowner out.
 */
export function isSignLinkExpired(
  sentAt: string | undefined,
  now: number = Date.now(),
): boolean {
  if (!sentAt) return false;
  const sent = Date.parse(sentAt);
  if (!Number.isFinite(sent)) return false;
  return now - sent > SIGN_TOKEN_TTL_MS;
}

/** Max decoded size of a hand-drawn signature image. */
export const MAX_SIGNATURE_BYTES = 200 * 1024; // 200 KB

/** A real base64 raster signature: PNG or JPEG only. */
const SIGNATURE_DATA_URL = /^data:image\/(?:png|jpe?g);base64,/i;

/**
 * Validates a signature data URL from the public sign form. Because that path
 * runs as the RLS-bypassing service role, we must not trust the payload: it has
 * to be a base64 PNG/JPEG and within the size cap. Returns a user-facing reason
 * when invalid, or `null` when it's acceptable.
 */
export function validateSignatureDataUrl(dataUrl: string): string | null {
  if (!dataUrl || !SIGNATURE_DATA_URL.test(dataUrl)) {
    return "Please draw your signature before submitting.";
  }
  const comma = dataUrl.indexOf(",");
  const b64 = comma >= 0 ? dataUrl.slice(comma + 1) : "";
  if (b64.length === 0) {
    return "Please draw your signature before submitting.";
  }
  // base64 → bytes: every 4 chars encode 3 bytes, minus any `=` padding.
  const padding = b64.endsWith("==") ? 2 : b64.endsWith("=") ? 1 : 0;
  const bytes = Math.floor((b64.length * 3) / 4) - padding;
  if (bytes <= 0) {
    return "Please draw your signature before submitting.";
  }
  if (bytes > MAX_SIGNATURE_BYTES) {
    return "That signature image is too large. Please draw a simpler signature and try again.";
  }
  return null;
}
