"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Edit, Trophy, MapPin, LogOut, Save, Plus, Trash2, Loader2, CheckCircle } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { updateTeamProfile } from "@/app/actions/team";
import type { DbSquadra, DbGiocatore } from "@/lib/types";

interface GiocatoreForm {
  nome: string;
  cognome: string;
  ruolo: string;
  instagram: string;
}

interface DashboardClientProps {
  squadra: DbSquadra;
  giocatori: DbGiocatore[];
  puntiTotali: number;
  tappeGiocate: number;
}

export default function DashboardClient({
  squadra,
  giocatori: initialGiocatori,
  puntiTotali,
  tappeGiocate,
}: DashboardClientProps) {
  const [giocatori, setGiocatori] = useState<GiocatoreForm[]>(
    initialGiocatori.map((g) => ({
      nome: g.nome,
      cognome: g.cognome,
      ruolo: g.ruolo || "",
      instagram: g.instagram || "",
    }))
  );
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

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

  const updateGiocatore = (index: number, field: keyof GiocatoreForm, value: string) => {
    const updated = [...giocatori];
    updated[index] = { ...updated[index], [field]: value };
    setGiocatori(updated);
  };

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setSaved(false);
    setSaving(true);

    const formData = new FormData(e.currentTarget);
    formData.set("giocatori", JSON.stringify(giocatori));

    const result = await updateTeamProfile(formData);

    if (result?.error) {
      setError(result.error);
    } else {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
    setSaving(false);
  }

  const slug = squadra.nome.toLowerCase().replace(/\s+/g, "-");

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
          <form action={logout}>
            <button
              type="submit"
              className="px-4 py-2 border border-border rounded-full text-sm text-muted hover:text-red-400 hover:border-red-400 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
              Esci
            </button>
          </form>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <Trophy size={18} className="text-primary mx-auto mb-1" />
            <p className="font-[family-name:var(--font-bebas)] text-2xl text-primary">
              {puntiTotali}
            </p>
            <p className="text-xs text-muted">Punti</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <MapPin size={18} className="text-accent mx-auto mb-1" />
            <p className="font-[family-name:var(--font-bebas)] text-2xl text-accent">
              {tappeGiocate}
            </p>
            <p className="text-xs text-muted">Tappe</p>
          </div>
          <div className="p-4 bg-surface rounded-xl border border-border text-center">
            <User size={18} className="text-gold mx-auto mb-1" />
            <p className="font-[family-name:var(--font-bebas)] text-2xl text-gold">
              {giocatori.length}/8
            </p>
            <p className="text-xs text-muted">Giocatori</p>
          </div>
        </div>

        <form onSubmit={handleSave}>
          {error && (
            <div className="p-4 mb-6 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
              {error}
            </div>
          )}

          {saved && (
            <div className="p-4 mb-6 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} />
              Modifiche salvate con successo!
            </div>
          )}

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
                    name="nome"
                    type="text"
                    required
                    defaultValue={squadra.nome}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Motto</label>
                  <input
                    name="motto"
                    type="text"
                    defaultValue={squadra.motto || ""}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Instagram</label>
                  <input
                    name="instagram"
                    type="text"
                    defaultValue={squadra.instagram || ""}
                    className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Telefono</label>
                  <input
                    name="telefono"
                    type="tel"
                    defaultValue={squadra.telefono || ""}
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
              <span className="text-sm text-muted">{giocatori.length}/8</span>
            </div>

            <div className="space-y-3">
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
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="text"
                      value={g.nome}
                      onChange={(e) => updateGiocatore(i, "nome", e.target.value)}
                      placeholder="Nome"
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <input
                      type="text"
                      value={g.cognome}
                      onChange={(e) => updateGiocatore(i, "cognome", e.target.value)}
                      placeholder="Cognome"
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
                    />
                    <select
                      value={g.ruolo}
                      onChange={(e) => updateGiocatore(i, "ruolo", e.target.value)}
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-muted focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Ruolo</option>
                      <option value="Guardia">Guardia</option>
                      <option value="Ala">Ala</option>
                      <option value="Centro">Centro</option>
                    </select>
                    <input
                      type="text"
                      value={g.instagram}
                      onChange={(e) => updateGiocatore(i, "instagram", e.target.value)}
                      placeholder="@instagram"
                      className="px-3 py-2 bg-surface border border-border rounded-lg text-sm text-foreground focus:outline-none focus:border-primary transition-colors"
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

          {/* Save button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full px-6 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50"
          >
            {saving ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            {saving ? "Salvataggio..." : "Salva Modifiche"}
          </button>
        </form>

        {/* View public profile */}
        <p className="text-sm text-muted text-center mt-6">
          <Link
            href={`/squadre/${slug}`}
            className="text-primary hover:text-gold transition-colors"
          >
            Vedi il profilo pubblico della tua squadra →
          </Link>
        </p>
      </div>
    </div>
  );
}
