import type { Metadata } from "next";
import { brand } from "@vantrow/brand";
import { LoginForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Log in",
};

export default function LoginPage() {
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
        <div className="mt-8">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
