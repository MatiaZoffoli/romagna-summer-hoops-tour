"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, Lock, CheckCircle } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { updatePassword } from "@/app/actions/auth";
import AckModal from "@/components/AckModal";

export default function ConfirmResetPasswordPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isValidLink, setIsValidLink] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Handle password reset tokens from Supabase
    async function handlePasswordReset() {
      const supabase = createClient();
      
      // Check if we have tokens in the URL hash
      const hash = window.location.hash;
      if (hash && hash.includes("access_token")) {
        // The tokens in the hash will be automatically processed by Supabase
        // Wait a moment for the session to be established
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Verify we have a valid session
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (user && !userError) {
          setIsValidLink(true);
        } else {
          setIsValidLink(false);
          setError("Link di reset non valido o scaduto.");
        }
      } else {
        // No tokens in hash - check if we have a valid session (user might have refreshed)
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          setIsValidLink(true);
        } else {
          setIsValidLink(false);
          setError("Link di reset non valido o scaduto.");
        }
      }
      
      setIsChecking(false);
    }

    handlePasswordReset();
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await updatePassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
    }
  }

  if (isChecking) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="p-8 bg-surface rounded-2xl border border-border text-center">
            <Loader2 size={48} className="text-primary mx-auto animate-spin mb-4" />
            <p className="text-muted text-sm">Verifica del link in corso...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!isValidLink) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="p-8 bg-surface rounded-2xl border border-border text-center">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
              Link Non Valido
            </h2>
            <p className="text-muted text-sm mb-6">
              Il link di reset password non è valido o è scaduto. Richiedi un nuovo link.
            </p>
            <Link
              href="/reset-password"
              className="inline-block px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
            >
              Richiedi Nuovo Link
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="p-8 bg-surface rounded-2xl border border-border text-center space-y-4">
            <CheckCircle size={48} className="text-green-500 mx-auto" />
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
              Password Aggiornata!
            </h2>
            <p className="text-muted text-sm">
              La tua password è stata aggiornata con successo. Ora puoi accedere con la nuova password.
            </p>
            <Link
              href="/dashboard"
              className="inline-block mt-4 px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors"
            >
              Vai alla Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-4xl mb-4 block">🏀</span>
          <h1 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-2">
            NUOVA PASSWORD
          </h1>
          <p className="text-muted text-sm">
            Inserisci la tua nuova password
          </p>
        </div>

        <AckModal
          open={!!error}
          onClose={() => setError("")}
          variant="error"
          title="Errore"
          message={error}
        />

        {/* Form */}
        <div className="p-8 bg-surface rounded-2xl border border-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm text-muted mb-2">Nuova Password</label>
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
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
              <p className="text-xs text-muted mt-1">Minimo 8 caratteri</p>
            </div>

            <div>
              <label className="block text-sm text-muted mb-2">Conferma Password</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  minLength={8}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Lock size={18} />
              )}
              {loading ? "Aggiornamento in corso..." : "Aggiorna Password"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-primary hover:text-gold transition-colors font-medium"
            >
              ← Torna al Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
