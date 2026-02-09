"use client";

import Link from "next/link";
import { useState } from "react";
import { Users, Plus, Trash2, Eye, EyeOff, CheckCircle } from "lucide-react";

interface GiocatoreForm {
  nome: string;
  cognome: string;
  ruolo: string;
  instagram: string;
}

export default function RegistrazionePage() {
  const [showPassword, setShowPassword] = useState(false);
  const [giocatori, setGiocatori] = useState<GiocatoreForm[]>([
    { nome: "", cognome: "", ruolo: "", instagram: "" },
    { nome: "", cognome: "", ruolo: "", instagram: "" },
    { nome: "", cognome: "", ruolo: "", instagram: "" },
  ]);
  const [accettaPrivacy, setAccettaPrivacy] = useState(false);

  const addGiocatore = () => {
    if (giocatori.length < 8) {
      setGiocatori([...giocatori, { nome: "", cognome: "", ruolo: "", instagram: "" }]);
    }
  };

  const removeGiocatore = (index: number) => {
    if (giocatori.length > 3) {
      setGiocatori(giocatori.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-2xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="text-4xl mb-4 block">🏀</span>
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl tracking-wider mb-2">
            REGISTRA LA TUA SQUADRA
          </h1>
          <p className="text-muted">
            Crea il profilo della tua squadra per il Romagna Summer Hoops Tour
          </p>
        </div>

        {/* Category */}
        <div className="mb-8">
          <label className="block text-sm text-muted mb-3">Categoria</label>
          <div className="flex items-center gap-3">
            <button className="px-4 py-2 bg-primary/20 border border-primary/40 rounded-full text-sm font-semibold text-primary">
              MASCHILE 16+
            </button>
            <button className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted/40 cursor-not-allowed" disabled>
              UNDER 16 - Coming Soon
            </button>
            <button className="px-4 py-2 bg-surface border border-border rounded-full text-sm text-muted/40 cursor-not-allowed" disabled>
              FEMMINILE - Coming Soon
            </button>
          </div>
        </div>

        {/* Form */}
        <div className="space-y-8">
          {/* Team info */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
              INFORMAZIONI SQUADRA
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">
                  Nome Squadra *
                </label>
                <input
                  type="text"
                  placeholder="Es: Rimini Ballers"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">
                  Motto / Slogan (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="Es: Dalla spiaggia al playground"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">
                  Instagram Squadra (opzionale)
                </label>
                <input
                  type="text"
                  placeholder="@nomesquadra"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Account info */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
              CREDENZIALI DI ACCESSO
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="team@email.com"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">
                  Telefono referente *
                </label>
                <input
                  type="tel"
                  placeholder="+39 333 1234567"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 8 caratteri"
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
            </div>
          </div>

          {/* Players */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                  GIOCATORI
                </h2>
                <p className="text-xs text-muted mt-1">
                  Minimo 3, massimo 8 giocatori per squadra
                </p>
              </div>
              <span className="text-sm text-muted">
                {giocatori.length}/8
              </span>
            </div>

            <div className="space-y-4">
              {giocatori.map((g, i) => (
                <div key={i} className="p-4 bg-background rounded-xl border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-primary font-semibold">
                      GIOCATORE {i + 1}
                    </span>
                    {giocatori.length > 3 && (
                      <button
                        type="button"
                        onClick={() => removeGiocatore(i)}
                        className="text-red-400 hover:text-red-300 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      placeholder="Nome *"
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="text"
                      placeholder="Cognome *"
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                    />
                    <select className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-muted focus:outline-none focus:border-primary transition-colors">
                      <option value="">Ruolo (opzionale)</option>
                      <option value="guardia">Guardia</option>
                      <option value="ala">Ala</option>
                      <option value="centro">Centro</option>
                    </select>
                    <input
                      type="text"
                      placeholder="@instagram"
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>

            {giocatori.length < 8 && (
              <button
                type="button"
                onClick={addGiocatore}
                className="mt-4 w-full px-4 py-3 border border-dashed border-border rounded-xl text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm"
              >
                <Plus size={16} />
                Aggiungi Giocatore
              </button>
            )}
          </div>

          {/* Privacy & Submit */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <div className="flex items-start gap-3 mb-6">
              <button
                type="button"
                onClick={() => setAccettaPrivacy(!accettaPrivacy)}
                className={`w-5 h-5 rounded border shrink-0 mt-0.5 flex items-center justify-center transition-colors ${
                  accettaPrivacy
                    ? "bg-primary border-primary"
                    : "border-border hover:border-primary"
                }`}
              >
                {accettaPrivacy && <CheckCircle size={14} className="text-white" />}
              </button>
              <p className="text-sm text-muted leading-relaxed">
                Accetto che i dati inseriti siano visibili pubblicamente sul sito del Romagna
                Summer Hoops Tour e possano essere condivisi con gli organizzatori delle tappe
                ai fini dell&apos;organizzazione dei tornei. Acconsento inoltre ad essere contattato
                per eventi futuri. *
              </p>
            </div>

            <button
              type="submit"
              className="w-full px-6 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-lg"
            >
              <Users size={20} />
              Registra Squadra
            </button>
          </div>
        </div>

        {/* Login redirect */}
        <p className="text-sm text-muted text-center mt-8">
          Hai già un account?{" "}
          <Link
            href="/login"
            className="text-primary hover:text-gold transition-colors font-medium"
          >
            Accedi qui
          </Link>
        </p>
      </div>
    </div>
  );
}
