"use client";

import Link from "next/link";
import { User, Edit, Trophy, MapPin, LogOut, Save, Plus, Trash2 } from "lucide-react";

export default function DashboardPage() {
  // Placeholder data - will be from Supabase auth session
  const squadra = {
    nome: "Rimini Ballers",
    motto: "Dalla spiaggia al playground.",
    instagram: "@riminiballers",
    email: "riminiballers@email.com",
    telefono: "+39 333 1234567",
    puntiTotali: 0,
    tappeGiocate: 0,
    giocatori: [
      { nome: "Simone", cognome: "Ferri", ruolo: "Guardia", instagram: "" },
      { nome: "Matteo", cognome: "Costa", ruolo: "Ala", instagram: "@matteocosta" },
      { nome: "Filippo", cognome: "Galli", ruolo: "Centro", instagram: "" },
    ],
  };

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <p className="text-primary text-sm font-semibold uppercase tracking-wider mb-1">
              Dashboard Squadra
            </p>
            <h1 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              {squadra.nome}
            </h1>
          </div>
          <button className="px-4 py-2 border border-border rounded-full text-sm text-muted hover:text-red-400 hover:border-red-400 transition-colors flex items-center gap-2">
            <LogOut size={16} />
            Esci
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <Trophy size={18} className="text-primary mx-auto mb-1" />
            <p className="font-[family-name:var(--font-bebas)] text-2xl text-primary">
              {squadra.puntiTotali}
            </p>
            <p className="text-xs text-muted">Punti</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <MapPin size={18} className="text-accent mx-auto mb-1" />
            <p className="font-[family-name:var(--font-bebas)] text-2xl text-accent">
              {squadra.tappeGiocate}
            </p>
            <p className="text-xs text-muted">Tappe</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <User size={18} className="text-gold mx-auto mb-1" />
            <p className="font-[family-name:var(--font-bebas)] text-2xl text-gold">
              {squadra.giocatori.length}/8
            </p>
            <p className="text-xs text-muted">Giocatori</p>
          </div>
        </div>

        {/* Edit team info */}
        <div className="p-8 bg-surface rounded-2xl border border-border mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Edit size={18} className="text-primary" />
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
              MODIFICA PROFILO
            </h2>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">Nome Squadra</label>
                <input
                  type="text"
                  defaultValue={squadra.nome}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Motto</label>
                <input
                  type="text"
                  defaultValue={squadra.motto}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-muted mb-2">Instagram</label>
                <input
                  type="text"
                  defaultValue={squadra.instagram}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Telefono</label>
                <input
                  type="tel"
                  defaultValue={squadra.telefono}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Edit roster */}
        <div className="p-8 bg-surface rounded-2xl border border-border mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <User size={18} className="text-primary" />
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                ROSTER
              </h2>
            </div>
            <span className="text-sm text-muted">{squadra.giocatori.length}/8</span>
          </div>

          <div className="space-y-3">
            {squadra.giocatori.map((g, i) => (
              <div
                key={i}
                className="p-4 bg-background rounded-xl border border-border"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs text-primary font-semibold">
                    GIOCATORE {i + 1}
                  </span>
                  {squadra.giocatori.length > 3 && (
                    <button className="text-red-400 hover:text-red-300 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    defaultValue={g.nome}
                    placeholder="Nome"
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <input
                    type="text"
                    defaultValue={g.cognome}
                    placeholder="Cognome"
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                  <select
                    defaultValue={g.ruolo.toLowerCase()}
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-muted focus:outline-none focus:border-primary transition-colors"
                  >
                    <option value="">Ruolo</option>
                    <option value="guardia">Guardia</option>
                    <option value="ala">Ala</option>
                    <option value="centro">Centro</option>
                  </select>
                  <input
                    type="text"
                    defaultValue={g.instagram}
                    placeholder="@instagram"
                    className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
            ))}
          </div>

          {squadra.giocatori.length < 8 && (
            <button className="mt-4 w-full px-4 py-3 border border-dashed border-border rounded-xl text-muted hover:text-primary hover:border-primary transition-colors flex items-center justify-center gap-2 text-sm">
              <Plus size={16} />
              Aggiungi Giocatore
            </button>
          )}
        </div>

        {/* Save button */}
        <button className="w-full px-6 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-lg">
          <Save size={20} />
          Salva Modifiche
        </button>

        {/* View public profile */}
        <p className="text-sm text-muted text-center mt-6">
          <Link
            href="/squadre/rimini-ballers"
            className="text-primary hover:text-gold transition-colors"
          >
            Vedi il profilo pubblico della tua squadra →
          </Link>
        </p>
      </div>
    </div>
  );
}
