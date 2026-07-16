import type { Metadata } from "next";
import { brand } from "@vantrow/brand";
import { SignupForm } from "@/components/auth-form";

export const metadata: Metadata = {
  title: "Create your account",
};

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-foreground/10 bg-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold tracking-tight text-brand-dark">
            Start your {brand.name} workspace
          </h1>
          <p className="mt-1 text-sm text-muted">
            Create an account and get your own company pipeline in seconds.
          </p>
        </div>
        <div className="mt-8">
          <SignupForm />
        </div>
      </div>
    </div>
  );
}
