"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const form = new FormData(e.currentTarget);
    const username = form.get("username") as string;
    const password = form.get("password") as string;

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[var(--i2p-navy)] to-[var(--i2p-navy-dark)] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex items-center justify-center gap-2">
            <svg viewBox="0 0 36 36" className="size-8" aria-hidden="true">
              <rect x="0" y="0" width="15" height="15" rx="2" fill="#EF8B1D" />
              <rect x="19" y="0" width="15" height="15" rx="2" fill="#E56910" />
              <rect x="0" y="19" width="15" height="15" rx="2" fill="#00446A" />
              <rect x="19" y="19" width="15" height="15" rx="2" fill="#E56910" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Inside Your Dynamic Model
          </h1>
          <p className="mt-1 text-sm text-white/50">
            Sign in to view this presentation
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm"
        >
          {error && (
            <div className="mb-4 rounded-lg bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="mb-4">
            <label htmlFor="username" className="mb-1.5 block text-sm font-medium text-white/70">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[var(--i2p-orange)] focus:ring-1 focus:ring-[var(--i2p-orange)]"
              placeholder="Enter your username"
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-white/70">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white placeholder-white/30 outline-none transition-colors focus:border-[var(--i2p-orange)] focus:ring-1 focus:ring-[var(--i2p-orange)]"
              placeholder="Enter your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[var(--i2p-orange)] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[var(--i2p-orange-light)] disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
