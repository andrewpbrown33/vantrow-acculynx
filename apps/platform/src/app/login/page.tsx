import type { Metadata } from "next";
import { brand } from "@vantrow/brand";
import { LoginForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Log in",
};

/** Friendly text for known notice codes passed via redirects (e.g. /auth/confirm). */
const NOTICES: Record<string, string> = {
  confirm_retry:
    "That confirmation link was already used or has expired — this often just means your email is already confirmed. Try signing in below; if your password works, you're all set.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; notice?: string }>;
}) {
  const params = await searchParams;
  const notice = params.notice ? NOTICES[params.notice] : undefined;
  const error = params.error;

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-foreground/10 bg-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted">
            Sign in to your {brand.name} workspace.
          </p>
        </div>
        {notice && (
          <p
            role="status"
            className="mt-6 rounded-md border border-brand/20 bg-brand/5 px-4 py-3 text-sm text-brand-dark"
          >
            {notice}
          </p>
        )}
        {error && (
          <p
            role="alert"
            className="mt-6 rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          >
            {error}
          </p>
        )}
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
