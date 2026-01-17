"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { loginAction } from "./actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Lock, Mail, ShieldCheck } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button
      type="submit"
      disabled={pending}
      className="
        h-11 w-full rounded-xl font-medium tracking-wide
        bg-zinc-900 text-white hover:bg-zinc-800
        dark:bg-white dark:text-zinc-900 dark:hover:bg-zinc-200
        shadow-lg shadow-black/10 dark:shadow-black/40
        transition
      "
    >
      {pending ? "Signing in..." : "Sign in"}
    </Button>
  );
}

export default function LoginPage() {
  const [state, formAction] = useActionState(loginAction, null);

  return (
    <main className="min-h-screen w-full relative overflow-hidden flex items-center justify-center px-4 bg-gradient-to-br from-slate-50 via-slate-100 to-sky-100 dark:from-zinc-950 dark:via-zinc-900 dark:to-zinc-950">
      {/* subtle grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06] dark:opacity-[0.05]
        [background-image:linear-gradient(to_right,rgba(0,0,0,0.15)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.15)_1px,transparent_1px)]
        dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.12)_1px,transparent_1px)]
        [background-size:48px_48px]"
      />

      {/* soft blobs (enterprise level, low opacity) */}
      <div className="absolute inset-0">
        <div className="absolute -top-32 -left-32 h-[420px] w-[420px] rounded-full bg-sky-400/20 blur-3xl" />
        <div className="absolute top-10 right-[-160px] h-[520px] w-[520px] rounded-full bg-indigo-400/15 blur-3xl" />
        <div className="absolute bottom-[-200px] left-1/3 h-[520px] w-[520px] rounded-full bg-emerald-400/10 blur-3xl" />
      </div>

      {/* container */}
      <div className="relative w-full max-w-5xl grid lg:grid-cols-2 gap-6 items-stretch">
        {/* Left info panel */}
        <div className="hidden lg:flex flex-col justify-between rounded-3xl border border-black/5 dark:border-white/10 bg-white/50 dark:bg-white/[0.04] backdrop-blur-xl p-10 shadow-2xl">
          <div>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-2xl bg-zinc-900/90 dark:bg-white/90 flex items-center justify-center">
                <ShieldCheck className="h-5 w-5 text-white dark:text-zinc-900" />
              </div>

              <div>
                <p className="text-sm text-zinc-500 dark:text-white/60">
                  ERP System
                </p>
                <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">
                  Secure Admin Access
                </h2>
              </div>
            </div>

            <p className="mt-6 text-sm leading-6 text-zinc-600 dark:text-white/60">
              Manage tickets, employees, projects, departments, and reports from a
              single dashboard. Access is protected with secure authentication.
            </p>
          </div>

          <div className="text-xs text-zinc-500 dark:text-white/40">
            © {new Date().getFullYear()} e-Report • Internal System
          </div>
        </div>

        {/* Right login card */}
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/[0.06] backdrop-blur-2xl p-8 sm:p-10 shadow-2xl">
          <div className="mb-8">
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-white tracking-tight">
              Sign in
            </h1>
            <p className="mt-2 text-sm text-zinc-600 dark:text-white/60">
              Enter your credentials to continue.
            </p>
          </div>

          <form action={formAction} className="space-y-5">
            {/* Email */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-white/70">
                Email
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-4 py-3 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition">
                <Mail className="h-4 w-4 text-zinc-500 dark:text-white/50" />
                <Input
                  name="email"
                  type="email"
                  placeholder="officer@ereport.com"
                  required
                  className="border-0 bg-transparent p-0 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-700 dark:text-white/70">
                Password
              </label>
              <div className="flex items-center gap-3 rounded-xl border border-black/10 dark:border-white/10 bg-white/70 dark:bg-white/[0.04] px-4 py-3 focus-within:ring-2 focus-within:ring-zinc-900/10 dark:focus-within:ring-white/10 transition">
                <Lock className="h-4 w-4 text-zinc-500 dark:text-white/50" />
                <Input
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  className="border-0 bg-transparent p-0 text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-white/40 focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
            </div>

            {/* Error */}
            {state?.error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3">
                <p className="text-sm text-red-600 dark:text-red-200">
                  {state.error}
                </p>
              </div>
            )}

            {/* Button */}
            <SubmitButton />

            {/* Small footer */}
            <p className="text-xs text-zinc-500 dark:text-white/40 text-center">
              Having trouble? Contact your system administrator.
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}