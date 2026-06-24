"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

function I2PLogo() {
  return (
    <svg viewBox="0 0 28 28" className="mx-auto size-11" aria-hidden="true">
      <rect x={0} y={0} width={12} height={12} rx={1.5} fill="#d4712a" />
      <rect x={16} y={0} width={12} height={12} rx={1.5} fill="#e8944a" />
      <rect x={0} y={16} width={12} height={12} rx={1.5} fill="#1e2a3a" />
      <rect x={16} y={16} width={12} height={12} rx={1.5} fill="#d4712a" />
    </svg>
  );
}

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setPending(true);

    const form = new FormData(e.currentTarget);
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/");
        return;
      }

      const data = await res.json().catch(() => null);
      setError(data?.error || "Invalid credentials");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5] px-4">
      <div className="w-full max-w-[400px] rounded-xl border border-[#e0e0e0] bg-white p-8 text-center sm:p-10">
        <I2PLogo />

        <h1 className="mt-4 text-[22px] font-bold text-[#1a1a2e]">
          Inside Your Dynamic Model
        </h1>
        <p className="mb-6 mt-1 text-sm text-[#666]">
          Sign in to view this presentation
        </p>

        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-left text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="text-left">
          <label className="mb-1 block text-sm font-medium text-[#555]">
            Email
          </label>
          <input
            name="username"
            type="email"
            required
            autoFocus
            autoComplete="email"
            placeholder="Enter your email"
            className="mb-4 w-full rounded-lg border border-[#d0d0d0] px-3 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors placeholder:text-[#aaa] focus:border-[#00446a] focus:ring-1 focus:ring-[#00446a]"
          />

          <label className="mb-1 block text-sm font-medium text-[#555]">
            Password
          </label>
          <input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="Enter your password"
            className="mb-5 w-full rounded-lg border border-[#d0d0d0] px-3 py-2.5 text-sm text-[#1a1a2e] outline-none transition-colors placeholder:text-[#aaa] focus:border-[#00446a] focus:ring-1 focus:ring-[#00446a]"
          />

          <button
            type="submit"
            disabled={pending}
            className="w-full rounded-lg bg-[#00446a] px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#003555] disabled:opacity-60"
          >
            {pending ? (
              <span className="inline-flex items-center gap-2">
                <svg className="size-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" className="opacity-25" />
                  <path d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-75" />
                </svg>
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
