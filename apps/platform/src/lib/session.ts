import { getStore } from "./store";
import type { Org, User } from "./types";

export interface Session {
  org: Org;
  user: User;
}

/**
 * The current session.
 *
 * v1 runs a single seeded demo org with no login — the first org and its owner
 * are returned. Accessing the store here also triggers first-run seeding.
 *
 * TODO(supabase-auth): replace this with real auth (Supabase Auth + a
 * memberships table) that resolves the signed-in user and their active org
 * from the request/session cookie.
 */
export async function getSession(): Promise<Session> {
  const store = getStore();
  const orgs = await store.listOrgs();
  const org = orgs[0];
  if (!org) throw new Error("No org has been seeded");
  const users = await store.listUsers(org.id);
  const user = users.find((u) => u.role === "owner") ?? users[0];
  if (!user) throw new Error("Demo org has no users");
  return { org, user };
}
