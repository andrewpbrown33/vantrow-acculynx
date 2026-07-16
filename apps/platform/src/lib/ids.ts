/**
 * Short, prefixed, collision-resistant ids (e.g. `job_1a2b3c4d5e6f`).
 *
 * Uses the Web Crypto UUID generator (available as a global in Node 18+ and
 * every modern browser) — never Math.random — so ids stay unpredictable and
 * unique across processes.
 */
export function genId(prefix: string): string {
  return `${prefix}_${crypto.randomUUID().slice(0, 12)}`;
}

/** A full RFC 4122 UUID, used for public sign tokens and PSP references. */
export function genToken(): string {
  return crypto.randomUUID();
}
