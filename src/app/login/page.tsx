"use client";

import Link from "next/link";
import { useState } from "react";
import { LogIn, Eye, EyeOff, Loader2 } from "lucide-react";
import { login } from "@/app/actions/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await login(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🏀</span>
          <h1 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-2">
            ACCEDI
          </h1>
          <p className="text-muted text-sm">
            Accedi al profilo della tua squadra
          </p>
        </div>

        {/* Form */}
        <div className="p-8 bg-surface rounded-2xl border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm text-muted mb-2">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="team@email.com"
                className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <Loader2 size={18} className="animate-spin" /> : <LogIn size={18} />}
              {loading ? "Accesso in corso..." : "Accedi"}
            </button>
          </form>

          <div className="mt-4 text-center">
            <Link
              href="/reset-password"
              className="text-sm text-primary hover:text-gold transition-colors font-medium"
            >
              Password dimenticata?
            </Link>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted">
              Non hai un account?{" "}
              <Link
                href="/registrazione"
                className="text-primary hover:text-gold transition-colors font-medium"
              >
                Registra la tua squadra
              </Link>
            </p>
          </div>
        </div>

        {/* Info */}
        <p className="text-xs text-muted/60 text-center mt-6">
          L&apos;accesso e&apos; riservato ai rappresentanti delle squadre registrate al Tour.
        </p>
      </div>
    </div>
  );
}
