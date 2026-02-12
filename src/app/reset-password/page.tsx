"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, Loader2 } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";
import AckModal from "@/components/AckModal";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    const formData = new FormData();
    formData.append("email", email);

    const result = await resetPassword(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else if (result?.success) {
      setSuccess(true);
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
            RESET PASSWORD
          </h1>
          <p className="text-muted text-sm">
            Inserisci la tua email per ricevere il link di reset
          </p>
        </div>

        <AckModal
          open={success}
          onClose={() => setSuccess(false)}
          variant="success"
          title="Email Inviata!"
          message="Controlla la tua casella email. Ti abbiamo inviato un link per reimpostare la password. Se non trovi l'email, controlla anche la cartella spam."
          buttonLabel="Chiudi"
        />
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
                <label className="block text-sm text-muted mb-2">Email</label>
                <input
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="team@email.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <Mail size={18} />
                )}
                {loading ? "Invio in corso..." : "Invia Link di Reset"}
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
