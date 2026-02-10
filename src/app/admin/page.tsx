"use client";

import { useState } from "react";
import { Shield, Trophy, Plus, Newspaper, MapPin, Loader2, CheckCircle, Lock } from "lucide-react";
import { addTappaResult, updateTappaStatus, addNews, addTappa, getAdminData } from "@/app/actions/admin";
import { sistemaPunteggio } from "@/data/placeholder";

interface AdminData {
  tappe: { id: string; slug: string; nome: string; stato: string }[];
  squadre: { id: string; nome: string }[];
  risultati: { id: string; posizione: number; punti: number; tappe: { nome: string }; squadre: { nome: string } }[];
  news: { id: string; titolo: string; data: string }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"risultati" | "tappe" | "news" | "stato">("risultati");

  async function handleLogin() {
    setLoading(true);
    setError("");
    const result = await getAdminData(password);
    if (result) {
      setData(result);
      setAuthenticated(true);
    } else {
      setError("Password non valida.");
    }
    setLoading(false);
  }

  async function refreshData() {
    const result = await getAdminData(password);
    if (result) setData(result);
  }

  function showMessage(msg: string) {
    setMessage(msg);
    setTimeout(() => setMessage(""), 3000);
  }

  async function handleAddResult(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    const result = await addTappaResult(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Risultato aggiunto!");
      await refreshData();
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleUpdateStatus(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    const result = await updateTappaStatus(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Stato aggiornato!");
      await refreshData();
    }
    setLoading(false);
  }

  async function handleAddNews(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    const result = await addNews(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("News pubblicata!");
      await refreshData();
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleAddTappa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    const result = await addTappa(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Tappa aggiunta!");
      await refreshData();
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <Shield size={48} className="text-primary mx-auto mb-4" />
            <h1 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-2">
              ADMIN PANEL
            </h1>
            <p className="text-muted text-sm">Accesso riservato all&apos;amministratore</p>
          </div>

          <div className="p-8 bg-surface rounded-2xl border border-border">
            {error && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                {error}
              </div>
            )}
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">Password Admin</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors"
                />
              </div>
              <button
                onClick={handleLogin}
                disabled={loading}
                className="w-full px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Lock size={18} />}
                Accedi
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors text-sm";

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-5xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider">
              <Shield size={24} className="inline text-primary mr-2" />
              ADMIN PANEL
            </h1>
            <p className="text-sm text-muted mt-1">
              {data?.squadre.length} squadre · {data?.tappe.length} tappe · {data?.risultati.length} risultati
            </p>
          </div>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-sm flex items-center gap-2">
            <CheckCircle size={16} />
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "risultati" as const, label: "Inserisci Risultati", icon: Trophy },
            { id: "stato" as const, label: "Stato Tappe", icon: MapPin },
            { id: "tappe" as const, label: "Nuova Tappa", icon: Plus },
            { id: "news" as const, label: "Nuova News", icon: Newspaper },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setError(""); }}
              className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? "bg-primary text-white"
                  : "bg-surface border border-border text-muted hover:text-foreground"
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== INSERISCI RISULTATI ===== */}
        {activeTab === "risultati" && (
          <div className="space-y-6">
            <div className="p-8 bg-surface rounded-2xl border border-border">
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
                INSERISCI RISULTATO
              </h2>

              <form onSubmit={handleAddResult} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-muted mb-2">Tappa</label>
                    <select name="tappaId" required className={inputClass}>
                      <option value="">Seleziona tappa...</option>
                      {data?.tappe.map((t) => (
                        <option key={t.id} value={t.id}>{t.nome} ({t.stato})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Squadra</label>
                    <select name="squadraId" required className={inputClass}>
                      <option value="">Seleziona squadra...</option>
                      {data?.squadre.map((s) => (
                        <option key={s.id} value={s.id}>{s.nome}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Posizione</label>
                    <input name="posizione" type="number" min="1" required placeholder="Es: 1" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Punti</label>
                    <input name="punti" type="number" min="0" required placeholder="Es: 100" className={inputClass} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Trophy size={16} />}
                  Aggiungi Risultato
                </button>
              </form>

              {/* Points reference */}
              <div className="mt-6 p-4 bg-background rounded-xl border border-border">
                <p className="text-xs text-muted uppercase tracking-wider mb-3">Sistema Punteggio</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {sistemaPunteggio.map((p) => (
                    <div key={p.posizione} className="text-sm">
                      <span className="text-muted">{p.posizione}:</span>{" "}
                      <span className="text-primary font-semibold">{p.punti} PT</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recent results */}
            {data && data.risultati.length > 0 && (
              <div className="p-8 bg-surface rounded-2xl border border-border">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4">
                  RISULTATI RECENTI
                </h3>
                <div className="space-y-2">
                  {data.risultati.slice(0, 10).map((r) => (
                    <div key={r.id} className="flex items-center justify-between p-3 bg-background rounded-lg text-sm">
                      <span className="text-muted">{r.tappe?.nome} - {r.squadre?.nome}</span>
                      <span className="text-primary font-semibold">{r.posizione}° - {r.punti} PT</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== STATO TAPPE ===== */}
        {activeTab === "stato" && (
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
              AGGIORNA STATO TAPPE
            </h2>
            <div className="space-y-4">
              {data?.tappe.map((t) => (
                <form key={t.id} onSubmit={handleUpdateStatus} className="flex items-center gap-4 p-4 bg-background rounded-xl border border-border">
                  <input type="hidden" name="tappaId" value={t.id} />
                  <span className="font-semibold text-foreground min-w-[120px]">{t.nome}</span>
                  <select name="stato" defaultValue={t.stato} className="px-3 py-2 bg-surface border border-border rounded-lg text-sm flex-1">
                    <option value="in-arrivo">In Arrivo</option>
                    <option value="prossima">Prossima</option>
                    <option value="completata">Completata</option>
                  </select>
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50">
                    Aggiorna
                  </button>
                </form>
              ))}
            </div>
          </div>
        )}

        {/* ===== NUOVA TAPPA ===== */}
        {activeTab === "tappe" && (
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
              AGGIUNGI NUOVA TAPPA
            </h2>
            <form onSubmit={handleAddTappa} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Nome Breve *</label>
                  <input name="nome" required placeholder="Es: KOTG" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Nome Completo</label>
                  <input name="nomeCompleto" placeholder="Es: Kings of the Ghetto - Tappa..." className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Data *</label>
                  <input name="data" required placeholder="Es: Sabato 11 Luglio 2026" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Orario</label>
                  <input name="orario" placeholder="16:00" defaultValue="16:00" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Luogo *</label>
                  <input name="luogo" required placeholder="Es: Cesenatico" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Indirizzo</label>
                  <input name="indirizzo" placeholder="Es: Cesenatico (FC)" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Provincia</label>
                  <input name="provincia" placeholder="Es: Forli-Cesena" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Organizzatore</label>
                  <input name="organizzatore" placeholder="Es: Ghetto Ponente" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Contatto Organizzatore</label>
                  <input name="contattoOrganizzatore" placeholder="Email organizzatore" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Instagram</label>
                  <input name="instagram" placeholder="@handle" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Stato</label>
                  <select name="stato" defaultValue="in-arrivo" className={inputClass}>
                    <option value="in-arrivo">In Arrivo</option>
                    <option value="prossima">Prossima</option>
                    <option value="completata">Completata</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Descrizione</label>
                <textarea name="descrizione" rows={3} placeholder="Descrizione della tappa..." className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                Aggiungi Tappa
              </button>
            </form>
          </div>
        )}

        {/* ===== NUOVA NEWS ===== */}
        {activeTab === "news" && (
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-6">
              PUBBLICA NEWS
            </h2>
            <form onSubmit={handleAddNews} className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">Titolo *</label>
                <input name="titolo" required placeholder="Titolo dell'articolo..." className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Anteprima *</label>
                <input name="anteprima" required placeholder="Breve anteprima (1-2 frasi)..." className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Contenuto *</label>
                <textarea name="contenuto" required rows={6} placeholder="Contenuto completo dell'articolo..." className={inputClass} />
              </div>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Newspaper size={16} />}
                Pubblica News
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
