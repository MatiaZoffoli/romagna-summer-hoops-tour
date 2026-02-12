"use client";

import { useState } from "react";
import { Shield, Trophy, Plus, Newspaper, MapPin, Loader2, CheckCircle, Lock, FileText, X, Eye, Edit2 } from "lucide-react";
import { addTappaResult, updateTappaStatus, addNews, addTappa, getAdminData, approveTappaApplication, rejectTappaApplication, sendTestEmail } from "@/app/actions/admin";
import { sistemaPunteggio } from "@/data/placeholder";
import AckModal from "@/components/AckModal";

interface AdminData {
  tappe: { id: string; slug: string; nome: string; stato: string }[];
  squadre: { id: string; nome: string }[];
  risultati: { id: string; posizione: number; punti: number; tappe: { nome: string }; squadre: { nome: string } }[];
  news: { id: string; titolo: string; data: string }[];
  applications: {
    id: string;
    nome_organizzatore: string;
    email_organizzatore: string;
    telefono_organizzatore: string | null;
    nome_torneo: string;
    nome_completo_torneo: string | null;
    data_proposta: string;
    orario_proposto: string;
    luogo: string;
    indirizzo: string | null;
    provincia: string | null;
    instagram_torneo: string | null;
    descrizione: string | null;
    numero_squadre_previste: number | null;
    note_aggiuntive: string | null;
    stato: string;
    created_at: string;
  }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"risultati" | "tappe" | "news" | "stato" | "applicazioni">("risultati");
  const [previewApp, setPreviewApp] = useState<AdminData["applications"][0] | null>(null);
  const [editingApp, setEditingApp] = useState<AdminData["applications"][0] | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null);
  const [testingEmail, setTestingEmail] = useState(false);

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

  async function handleApproveApplication(e: React.FormEvent<HTMLFormElement> | null, applicationId?: string) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e?.currentTarget || undefined);
    formData.set("adminPassword", password);
    formData.set("applicationId", applicationId || editingApp?.id || "");
    
    // Include edited fields if editing
    if (editingApp) {
      const nome = (e?.currentTarget?.querySelector('[name="nome"]') as HTMLInputElement)?.value || editingApp.nome_torneo;
      const nomeCompleto = (e?.currentTarget?.querySelector('[name="nomeCompleto"]') as HTMLInputElement)?.value || editingApp.nome_completo_torneo || "";
      const data = (e?.currentTarget?.querySelector('[name="data"]') as HTMLInputElement)?.value || editingApp.data_proposta;
      const orario = (e?.currentTarget?.querySelector('[name="orario"]') as HTMLInputElement)?.value || editingApp.orario_proposto;
      const luogo = (e?.currentTarget?.querySelector('[name="luogo"]') as HTMLInputElement)?.value || editingApp.luogo;
      const indirizzo = (e?.currentTarget?.querySelector('[name="indirizzo"]') as HTMLInputElement)?.value || editingApp.indirizzo || "";
      const provincia = (e?.currentTarget?.querySelector('[name="provincia"]') as HTMLInputElement)?.value || editingApp.provincia || "";
      const organizzatore = (e?.currentTarget?.querySelector('[name="organizzatore"]') as HTMLInputElement)?.value || editingApp.nome_organizzatore;
      const contattoOrganizzatore = (e?.currentTarget?.querySelector('[name="contattoOrganizzatore"]') as HTMLInputElement)?.value || editingApp.email_organizzatore;
      const instagram = (e?.currentTarget?.querySelector('[name="instagram"]') as HTMLInputElement)?.value || editingApp.instagram_torneo || "";
      const descrizione = (e?.currentTarget?.querySelector('[name="descrizione"]') as HTMLTextAreaElement)?.value || editingApp.descrizione || "";
      const stato = (e?.currentTarget?.querySelector('[name="stato"]') as HTMLSelectElement)?.value || "confermata";
      
      formData.set("nome", nome);
      formData.set("nomeCompleto", nomeCompleto);
      formData.set("data", data);
      formData.set("orario", orario);
      formData.set("luogo", luogo);
      formData.set("indirizzo", indirizzo);
      formData.set("provincia", provincia);
      formData.set("organizzatore", organizzatore);
      formData.set("contattoOrganizzatore", contattoOrganizzatore);
      formData.set("instagram", instagram);
      formData.set("descrizione", descrizione);
      formData.set("stato", stato);
    }
    
    const result = await approveTappaApplication(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Applicazione approvata! Tappa creata.");
      setEditingApp(null);
      await refreshData();
    }
    setLoading(false);
  }

  async function handleRejectApplication(applicationId: string, reason?: string) {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("applicationId", applicationId);
    if (reason) formData.set("reason", reason);
    const result = await rejectTappaApplication(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Applicazione rifiutata.");
      setShowRejectDialog(null);
      setRejectReason("");
      await refreshData();
    }
    setLoading(false);
  }

  // Login screen
  if (!authenticated) {
    return (
      <div className="pt-24 pb-20 min-h-screen flex items-center justify-center">
        <AckModal
          open={!!error}
          onClose={() => setError("")}
          variant="error"
          title="Accesso negato"
          message={error}
        />
        <div className="w-full max-w-md mx-auto px-4">
          <div className="text-center mb-8">
            <Shield size={48} className="text-primary mx-auto mb-4" />
            <h1 className="font-[family-name:var(--font-bebas)] text-4xl tracking-wider mb-2">
              ADMIN PANEL
            </h1>
            <p className="text-muted text-sm">Accesso riservato all&apos;amministratore</p>
          </div>

          <div className="p-8 bg-surface rounded-2xl border border-border">
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
              {data?.squadre.length} squadre · {data?.tappe.length} tappe · {data?.risultati.length} risultati · {data?.applications.filter(a => a.stato === 'pending').length || 0} applicazioni in attesa
            </p>
          </div>
        </div>

        <AckModal
          open={!!message}
          onClose={() => setMessage("")}
          variant="success"
          title="Operazione completata"
          message={message}
        />
        <AckModal
          open={!!error}
          onClose={() => setError("")}
          variant="error"
          title="Errore"
          message={error}
        />

        <div className="mb-6 flex items-center gap-4">
          <span className="text-sm text-muted">Email (SES):</span>
          <button
            type="button"
            disabled={loading || testingEmail}
            onClick={async () => {
              setTestingEmail(true);
              setError("");
              const result = await sendTestEmail(password);
              if (result.success) showMessage("Email di test inviata! Controlla la casella matiazoffoli@gmail.com");
              else setError(result.error ?? "Errore invio");
              setTestingEmail(false);
            }}
            className="px-4 py-2 rounded-full text-sm font-medium bg-surface border border-border text-muted hover:text-foreground hover:border-primary transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {testingEmail ? <Loader2 size={14} className="animate-spin" /> : null}
            Invia email di test
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 flex-wrap">
          {[
            { id: "risultati" as const, label: "Inserisci Risultati", icon: Trophy },
            { id: "stato" as const, label: "Stato Tappe", icon: MapPin },
            { id: "tappe" as const, label: "Nuova Tappa", icon: Plus },
            { id: "news" as const, label: "Nuova News", icon: Newspaper },
            { id: "applicazioni" as const, label: `Applicazioni${data?.applications.filter(a => a.stato === 'pending').length ? ` (${data.applications.filter(a => a.stato === 'pending').length})` : ''}`, icon: FileText },
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
                    <option value="pending">Pending</option>
                    <option value="confermata">Confermata</option>
                    <option value="in_corso">In corso</option>
                    <option value="in_attesa_risultati">In attesa risultati</option>
                    <option value="conclusa">Conclusa</option>
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
                  <select name="stato" defaultValue="confermata" className={inputClass}>
                    <option value="pending">Pending</option>
                    <option value="confermata">Confermata</option>
                    <option value="in_corso">In corso</option>
                    <option value="in_attesa_risultati">In attesa risultati</option>
                    <option value="conclusa">Conclusa</option>
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

        {/* ===== APPLICAZIONI ===== */}
        {activeTab === "applicazioni" && (
          <div className="space-y-6">
            {/* Preview Modal */}
            {previewApp && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                      ANTEPRIMA APPLICAZIONE
                    </h2>
                    <button
                      onClick={() => setPreviewApp(null)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">
                        {previewApp.nome_torneo}
                      </h3>
                      {previewApp.nome_completo_torneo && (
                        <p className="text-sm text-muted">{previewApp.nome_completo_torneo}</p>
                      )}
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted">Organizzatore:</span>{" "}
                        <span className="text-foreground font-medium">{previewApp.nome_organizzatore}</span>
                      </div>
                      <div>
                        <span className="text-muted">Email:</span>{" "}
                        <a href={`mailto:${previewApp.email_organizzatore}`} className="text-primary hover:text-gold">
                          {previewApp.email_organizzatore}
                        </a>
                      </div>
                      {previewApp.telefono_organizzatore && (
                        <div>
                          <span className="text-muted">Telefono:</span>{" "}
                          <span className="text-foreground">{previewApp.telefono_organizzatore}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-muted">Data:</span>{" "}
                        <span className="text-foreground">{previewApp.data_proposta} · {previewApp.orario_proposto}</span>
                      </div>
                      <div>
                        <span className="text-muted">Luogo:</span>{" "}
                        <span className="text-foreground">{previewApp.luogo}{previewApp.provincia ? ` (${previewApp.provincia})` : ''}</span>
                      </div>
                      {previewApp.indirizzo && (
                        <div>
                          <span className="text-muted">Indirizzo:</span>{" "}
                          <span className="text-foreground">{previewApp.indirizzo}</span>
                        </div>
                      )}
                      {previewApp.instagram_torneo && (
                        <div>
                          <span className="text-muted">Instagram:</span>{" "}
                          <span className="text-foreground">{previewApp.instagram_torneo}</span>
                        </div>
                      )}
                      {previewApp.numero_squadre_previste && (
                        <div>
                          <span className="text-muted">Squadre previste:</span>{" "}
                          <span className="text-foreground">{previewApp.numero_squadre_previste}</span>
                        </div>
                      )}
                    </div>
                    {previewApp.descrizione && (
                      <div>
                        <p className="text-xs text-muted mb-1">Descrizione:</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{previewApp.descrizione}</p>
                      </div>
                    )}
                    {previewApp.note_aggiuntive && (
                      <div className="p-3 bg-background rounded-lg border border-border">
                        <p className="text-xs text-muted mb-1">Note aggiuntive:</p>
                        <p className="text-sm text-foreground whitespace-pre-wrap">{previewApp.note_aggiuntive}</p>
                      </div>
                    )}
                    <div className="pt-4 border-t border-border flex gap-3">
                      <button
                        onClick={() => {
                          setPreviewApp(null);
                          setEditingApp(previewApp);
                        }}
                        className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
                      >
                        <Edit2 size={14} />
                        Modifica e Approva
                      </button>
                      <button
                        onClick={() => setPreviewApp(null)}
                        className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors"
                      >
                        Chiudi
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit Modal */}
            {editingApp && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                      MODIFICA E APPROVA
                    </h2>
                    <button
                      onClick={() => setEditingApp(null)}
                      className="p-2 hover:bg-background rounded-lg transition-colors"
                    >
                      <X size={20} />
                    </button>
                  </div>
                  <form onSubmit={(e) => handleApproveApplication(e)} className="p-6 space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted mb-2">Nome Breve *</label>
                        <input name="nome" defaultValue={editingApp.nome_torneo} required className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Nome Completo</label>
                        <input name="nomeCompleto" defaultValue={editingApp.nome_completo_torneo || ""} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Data *</label>
                        <input name="data" defaultValue={editingApp.data_proposta} required className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Orario</label>
                        <input name="orario" defaultValue={editingApp.orario_proposto || "16:00"} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Luogo *</label>
                        <input name="luogo" defaultValue={editingApp.luogo} required className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Indirizzo</label>
                        <input name="indirizzo" defaultValue={editingApp.indirizzo || ""} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Provincia</label>
                        <input name="provincia" defaultValue={editingApp.provincia || ""} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Organizzatore</label>
                        <input name="organizzatore" defaultValue={editingApp.nome_organizzatore} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Contatto Organizzatore</label>
                        <input name="contattoOrganizzatore" defaultValue={editingApp.email_organizzatore} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Instagram</label>
                        <input name="instagram" defaultValue={editingApp.instagram_torneo || ""} className={inputClass} />
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Stato</label>
                        <select name="stato" defaultValue="confermata" className={inputClass}>
                          <option value="pending">Pending</option>
                          <option value="confermata">Confermata</option>
                          <option value="in_corso">In corso</option>
                          <option value="in_attesa_risultati">In attesa risultati</option>
                          <option value="conclusa">Conclusa</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">Descrizione</label>
                      <textarea name="descrizione" rows={4} defaultValue={editingApp.descrizione || ""} className={inputClass} />
                    </div>
                    <div className="pt-4 border-t border-border flex gap-3">
                      <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                        Approva Tappa
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingApp(null)}
                        className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors"
                      >
                        Annulla
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Reject Dialog */}
            {showRejectDialog && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-md w-full">
                  <div className="p-6 border-b border-border">
                    <h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">
                      RIFIUTA APPLICAZIONE
                    </h2>
                  </div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">Motivo del rifiuto (opzionale)</label>
                      <textarea
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        rows={4}
                        placeholder="Inserisci un motivo per il rifiuto..."
                        className={inputClass}
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleRejectApplication(showRejectDialog, rejectReason)}
                        disabled={loading}
                        className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50"
                      >
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                        Conferma Rifiuto
                      </button>
                      <button
                        onClick={() => {
                          setShowRejectDialog(null);
                          setRejectReason("");
                        }}
                        className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors"
                      >
                        Annulla
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending Applications */}
            {data && data.applications.filter(a => a.stato === 'pending').length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">
                  IN ATTESA DI APPROVAZIONE
                </h2>
                <div className="space-y-4">
                  {data.applications.filter(a => a.stato === 'pending').map((app) => (
                    <div key={app.id} className="p-6 bg-surface rounded-2xl border border-border">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">
                            {app.nome_torneo}
                          </h3>
                          {app.nome_completo_torneo && (
                            <p className="text-sm text-muted mb-3">{app.nome_completo_torneo}</p>
                          )}
                        </div>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">
                          IN ATTESA
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="text-muted">Organizzatore:</span>{" "}
                          <span className="text-foreground font-medium">{app.nome_organizzatore}</span>
                        </div>
                        <div>
                          <span className="text-muted">Email:</span>{" "}
                          <a href={`mailto:${app.email_organizzatore}`} className="text-primary hover:text-gold">
                            {app.email_organizzatore}
                          </a>
                        </div>
                        {app.telefono_organizzatore && (
                          <div>
                            <span className="text-muted">Telefono:</span>{" "}
                            <span className="text-foreground">{app.telefono_organizzatore}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-muted">Data:</span>{" "}
                          <span className="text-foreground">{app.data_proposta} · {app.orario_proposto}</span>
                        </div>
                        <div>
                          <span className="text-muted">Luogo:</span>{" "}
                          <span className="text-foreground">{app.luogo}{app.provincia ? ` (${app.provincia})` : ''}</span>
                        </div>
                        {app.numero_squadre_previste && (
                          <div>
                            <span className="text-muted">Squadre previste:</span>{" "}
                            <span className="text-foreground">{app.numero_squadre_previste}</span>
                          </div>
                        )}
                      </div>

                      {app.descrizione && (
                        <p className="text-sm text-muted mb-4 line-clamp-2">{app.descrizione}</p>
                      )}

                      {app.note_aggiuntive && (
                        <div className="p-3 bg-background rounded-lg border border-border mb-4">
                          <p className="text-xs text-muted mb-1">Note aggiuntive:</p>
                          <p className="text-sm text-foreground line-clamp-2">{app.note_aggiuntive}</p>
                        </div>
                      )}

                      <div className="flex gap-3">
                        <button
                          onClick={() => setPreviewApp(app)}
                          className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Anteprima
                        </button>
                        <button
                          onClick={() => setEditingApp(app)}
                          className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
                        >
                          <Edit2 size={14} />
                          Modifica e Approva
                        </button>
                        <button
                          onClick={() => setShowRejectDialog(app.id)}
                          className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
                        >
                          <X size={14} />
                          Rifiuta
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved Applications */}
            {data && data.applications.filter(a => a.stato === 'approved').length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-green-400">
                  APPROVATE
                </h2>
                <div className="space-y-2">
                  {data.applications.filter(a => a.stato === 'approved').map((app) => (
                    <div key={app.id} className="p-4 bg-surface rounded-xl border border-green-500/20 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{app.nome_torneo}</span>
                        <span className="text-xs text-muted ml-2">di {app.nome_organizzatore}</span>
                      </div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Approvata</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Rejected Applications */}
            {data && data.applications.filter(a => a.stato === 'rejected').length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-red-400">
                  RIFIUTATE
                </h2>
                <div className="space-y-2">
                  {data.applications.filter(a => a.stato === 'rejected').map((app) => (
                    <div key={app.id} className="p-4 bg-surface rounded-xl border border-red-500/20 flex items-center justify-between">
                      <div>
                        <span className="font-medium">{app.nome_torneo}</span>
                        <span className="text-xs text-muted ml-2">di {app.nome_organizzatore}</span>
                      </div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Rifiutata</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* No applications */}
            {data && data.applications.length === 0 && (
              <div className="p-12 bg-surface rounded-2xl border border-dashed border-border text-center">
                <FileText size={48} className="mx-auto mb-4 text-primary/30" />
                <p className="text-muted">Nessuna applicazione ancora.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
