"use client";

import Link from "next/link";
import { useActionState } from "react";
import {
  signIn,
  signUp,
  type AuthFormState,
} from "@/lib/auth-actions";

const fieldClass =
  "mt-1 w-full rounded-md border border-foreground/20 bg-white px-3 py-2 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30";

const buttonClass =
  "w-full rounded-md bg-brand px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-60";

const initialState: AuthFormState = {};

function Alert({ state }: { state: AuthFormState }) {
  if (state.notice) {
    return (
      <p className="rounded-md bg-emerald-50 px-3 py-2 text-sm text-emerald-800 ring-1 ring-emerald-200">
        {state.notice}
      </p>
    );
  }
  if (state.error) {
    return (
      <p
        role="alert"
        className="rounded-md bg-rose-50 px-3 py-2 text-sm text-rose-800 ring-1 ring-rose-200"
      >
        {state.error}
      </p>
    );
  }
  return null;
}

export function LoginForm() {
  const [state, formAction, pending] = useActionState(signIn, initialState);
  return (
    <form action={formAction} className="space-y-4">
      <Alert state={state} />
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className={fieldClass}
        />
      </div>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Signing in…" : "Sign in"}
      </button>
      <p className="text-center text-sm text-muted">
        New here?{" "}
        <Link href="/signup" className="font-medium text-brand hover:text-brand-dark">
          Create an account
        </Link>
      </p>
    </form>
  );
}

export function SignupForm() {
  const [state, formAction, pending] = useActionState(signUp, initialState);
  return (
    <form action={formAction} className="space-y-4">
      <Alert state={state} />
      <div>
        <label htmlFor="name" className="block text-sm font-medium">
          Full name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          autoComplete="name"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="company" className="block text-sm font-medium">
          Company name
        </label>
        <input
          id="company"
          name="company"
          type="text"
          required
          autoComplete="organization"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium">
          Work email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          className={fieldClass}
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          minLength={6}
          autoComplete="new-password"
          className={fieldClass}
        />
      </div>
      <button type="submit" disabled={pending} className={buttonClass}>
        {pending ? "Creating account…" : "Create account"}
      </button>
      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link href="/login" className="font-medium text-brand hover:text-brand-dark">
          Sign in
        </Link>
      </p>
    </form>
  );
}
