"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { User, Edit, Trophy, MapPin, LogOut, Save, Plus, Trash2, Loader2, ImageIcon, Share2 } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { submitTeamChangeRequest } from "@/app/actions/team-change-request";
import { generateTeamLogo } from "@/app/actions/generate-team-logo";
import { setTeamLogoChoice } from "@/app/actions/set-team-logo-choice";
import { requestSocialBonus } from "@/app/actions/social-bonus";
import type { DbSquadra, DbGiocatore } from "@/lib/types";
import type { DbTappa } from "@/lib/types";
import AckModal from "@/components/AckModal";
import TeamAvatar from "@/components/TeamAvatar";
import { AVATAR_ICON_OPTIONS, AVATAR_COLOR_OPTIONS } from "@/lib/avatar-presets";

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
  tappe: DbTappa[];
  risultatiTappaIds: string[];
}

export default function DashboardClient({
  squadra,
  giocatori: initialGiocatori,
  puntiTotali,
  tappeGiocate,
  tappe,
  risultatiTappaIds,
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
  const [generatingLogo, setGeneratingLogo] = useState(false);
  const [logoProgress, setLogoProgress] = useState(0);
  const [showChooseLogo, setShowChooseLogo] = useState(false);
  const [generatedLogoUrl, setGeneratedLogoUrl] = useState<string | null>(null);
  const [selectedLogoChoice, setSelectedLogoChoice] = useState<"generated" | "url" | "preset" | "identicon" | null>(null);
  const [confirmingLogo, setConfirmingLogo] = useState(false);
  const [socialBonusSubmitting, setSocialBonusSubmitting] = useState(false);
  const [socialBonusDone, setSocialBonusDone] = useState(false);
  const router = useRouter();

  const tappeConRisultato = tappe.filter((t) => risultatiTappaIds.includes(t.id));

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
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("giocatori", JSON.stringify(giocatori));

    const result = await submitTeamChangeRequest(formData);

    if (result?.error) {
      setError(result.error);
      setSaving(false);
      return;
    }
    setSaved(true);
    setSaving(false);
    router.refresh();
  }

  async function handleGenerateLogo() {
    if (squadra.logo_generated_at) return;
    setError("");
    setGeneratingLogo(true);
    setLogoProgress(0);
    const interval = setInterval(() => {
      setLogoProgress((p) => Math.min(p + 12, 90));
    }, 800);
    const form = document.getElementById("dashboard-profile-form") as HTMLFormElement | undefined;
    const nome = form?.querySelector('[name="nome"]') ? (form.querySelector('[name="nome"]') as HTMLInputElement).value?.trim() : squadra.nome;
    const motto = form?.querySelector('[name="motto"]') ? (form.querySelector('[name="motto"]') as HTMLInputElement).value?.trim() || null : squadra.motto || null;
    const genResult = await generateTeamLogo({ nome: nome || squadra.nome, motto: motto ?? undefined });
    clearInterval(interval);
    setLogoProgress(100);
    setGeneratingLogo(false);
    if (genResult?.error) {
      setError(genResult.error);
      return;
    }
    if (genResult && "generated_logo_url" in genResult && genResult.generated_logo_url) {
      setGeneratedLogoUrl(genResult.generated_logo_url);
      setShowChooseLogo(true);
    }
    router.refresh();
  }

  async function confirmLogoChoice() {
    if (!selectedLogoChoice) return;
    setConfirmingLogo(true);
    const form = document.getElementById("dashboard-profile-form") as HTMLFormElement | undefined;
    const formData = new FormData();
    formData.set("choice", selectedLogoChoice);
    if (selectedLogoChoice === "url" && form) {
      const url = (form.querySelector('[name="logo_url"]') as HTMLInputElement)?.value?.trim();
      if (url) formData.set("logo_url", url);
    }
    if (selectedLogoChoice === "preset" && form) {
      const icon = (form.querySelector('[name="avatar_icon"]') as HTMLSelectElement)?.value;
      const color = (form.querySelector('[name="avatar_color"]') as HTMLSelectElement)?.value;
      if (icon) formData.set("avatar_icon", icon);
      if (color) formData.set("avatar_color", color);
    }
    const result = await setTeamLogoChoice(formData);
    setConfirmingLogo(false);
    if (result?.error) setError(result.error);
    else {
      setShowChooseLogo(false);
      setGeneratedLogoUrl(null);
      setSelectedLogoChoice(null);
      router.refresh();
    }
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

        <AckModal
          open={!!error}
          onClose={() => setError("")}
          variant="error"
          title="Errore"
          message={error}
        />
        <AckModal
          open={saved}
          onClose={() => setSaved(false)}
          variant="success"
          title="Richiesta inviata"
          message={"La tua richiesta di modifica è stata inviata.\nRiceverai un esito dopo la revisione da parte dell'organizzazione."}
        />

        <form id="dashboard-profile-form" onSubmit={handleSave}>
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

              {/* Logo / avatar personalisation */}
              <div className="pt-6 border-t border-border">
                <h3 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider mb-4">Personalizza quadrato squadra</h3>
                <div className="flex flex-wrap items-start gap-6">
                  <TeamAvatar squadra={squadra} size="md" />
                  <div className="flex-1 min-w-0 space-y-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">URL immagine squadra (opzionale)</label>
                      <input
                        name="logo_url"
                        type="url"
                        placeholder="https://..."
                        defaultValue={squadra.logo_url || ""}
                        className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-muted mb-2">Icona (se non usi immagine)</label>
                        <select
                          name="avatar_icon"
                          defaultValue={squadra.avatar_icon || ""}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="">Nessuna</option>
                          {AVATAR_ICON_OPTIONS.map((o) => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm text-muted mb-2">Colore sfondo</label>
                        <select
                          name="avatar_color"
                          defaultValue={squadra.avatar_color || ""}
                          className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary transition-colors"
                        >
                          <option value="">Predefinito</option>
                          {AVATAR_COLOR_OPTIONS.map((o) => (
                            <option key={o.id} value={o.id}>{o.label}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-muted mb-2">Una sola generazione consentita per squadra.</p>
                      {squadra.logo_generated_at ? (
                        <p className="text-sm text-muted">Logo già generato.</p>
                      ) : (
                        <button
                          type="button"
                          onClick={handleGenerateLogo}
                          disabled={generatingLogo}
                          className="px-4 py-2 rounded-full bg-primary/20 text-primary border border-primary hover:bg-primary hover:text-white transition-colors flex items-center gap-2 text-sm font-medium disabled:opacity-50"
                        >
                          {generatingLogo ? <Loader2 size={16} className="animate-spin" /> : <ImageIcon size={16} />}
                          {generatingLogo ? "Generazione in corso..." : "Genera logo con AI"}
                        </button>
                      )}
                    </div>
                  </div>
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
            {saving ? "Invio in corso..." : "Richiedi modifica"}
          </button>
        </form>

        {/* Richiedi bonus social */}
        {tappeConRisultato.length > 0 && (
          <div className="p-8 bg-surface rounded-2xl border border-border mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Share2 size={18} className="text-primary" />
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                Bonus social (+5 pt)
              </h2>
            </div>
            <p className="text-sm text-muted mb-4">
              Hai condiviso il template della tappa sui social? Richiedi il bonus di +5 punti per quella tappa. L&apos;organizzazione verificherà e approverà.
            </p>
            <form
              action={async (formData) => {
                setSocialBonusSubmitting(true);
                setError("");
                setSocialBonusDone(false);
                const result = await requestSocialBonus(formData);
                setSocialBonusSubmitting(false);
                if (result?.error) setError(result.error);
                else {
                  setSocialBonusDone(true);
                  router.refresh();
                }
              }}
              className="flex flex-wrap items-end gap-4"
            >
              <div className="min-w-[200px]">
                <label className="block text-sm text-muted mb-2">Tappa</label>
                <select name="tappa_id" required className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary">
                  <option value="">Seleziona...</option>
                  {tappeConRisultato.map((t) => (
                    <option key={t.id} value={t.id}>{t.nome}</option>
                  ))}
                </select>
              </div>
              <div className="flex-1 min-w-[200px]">
                <label className="block text-sm text-muted mb-2">Link al post (opzionale)</label>
                <input name="link_to_post" type="url" placeholder="https://..." className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:border-primary" />
              </div>
              <button type="submit" disabled={socialBonusSubmitting} className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50 flex items-center gap-2">
                {socialBonusSubmitting ? <Loader2 size={18} className="animate-spin" /> : <Share2 size={18} />}
                Richiedi bonus
              </button>
            </form>
            {socialBonusDone && <p className="text-sm text-green-400 mt-3">Richiesta inviata. Riceverai conferma dopo la revisione.</p>}
          </div>
        )}

        {/* Generating logo overlay */}
        {generatingLogo && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-surface rounded-2xl border border-border max-w-md w-full p-8 text-center">
              <Loader2 size={48} className="mx-auto mb-4 text-primary animate-spin" />
              <p className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">Stiamo creando la tua immagine</p>
              <p className="text-sm text-muted mb-6">Attendere prego...</p>
              <div className="h-2 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary transition-all duration-300" style={{ width: `${logoProgress}%` }} />
              </div>
            </div>
          </div>
        )}

        {/* Choose your logo modal */}
        {showChooseLogo && (generatedLogoUrl || squadra.generated_logo_url) && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full my-8 p-6">
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">Scegli il tuo logo</h2>
              <p className="text-sm text-muted mb-6">Scegli come mostrare il quadrato della squadra sul sito, poi clicca Conferma.</p>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  type="button"
                  onClick={() => setSelectedLogoChoice("generated")}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${selectedLogoChoice === "generated" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <div className="w-20 h-20 rounded-xl overflow-hidden mb-3 border border-border">
                    <img src={generatedLogoUrl || squadra.generated_logo_url || ""} alt="Generata" className="w-full h-full object-cover" />
                  </div>
                  <span className="font-medium">Usa immagine generata</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLogoChoice("url")}
                  className={`p-4 rounded-xl border-2 text-left transition-colors ${selectedLogoChoice === "url" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <div className="w-20 h-20 rounded-xl bg-background border border-border flex items-center justify-center mb-3">
                    <ImageIcon size={32} className="text-muted" />
                  </div>
                  <span className="font-medium">Usa il mio URL</span>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLogoChoice("preset")}
                  className={`p-4 rounded-xl border-2 text-left transition-colors col-span-2 ${selectedLogoChoice === "preset" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <TeamAvatar squadra={{ ...squadra, logo_url: null, avatar_icon: (document.querySelector('#dashboard-profile-form [name="avatar_icon"]') as HTMLSelectElement)?.value || null, avatar_color: (document.querySelector('#dashboard-profile-form [name="avatar_color"]') as HTMLSelectElement)?.value || null }} size="md" />
                    <span className="font-medium">Usa icona e colore selezionati</span>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedLogoChoice("identicon")}
                  className={`p-4 rounded-xl border-2 text-left transition-colors col-span-2 ${selectedLogoChoice === "identicon" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"}`}
                >
                  <div className="flex items-center gap-3">
                    <TeamAvatar squadra={{ ...squadra, logo_url: null, avatar_icon: null, avatar_color: null }} size="md" />
                    <span className="font-medium">Usa avatar predefinito</span>
                  </div>
                </button>
              </div>
              <div className="flex items-center justify-between gap-4">
                <button type="button" onClick={() => { setShowChooseLogo(false); setGeneratedLogoUrl(null); setSelectedLogoChoice(null); router.refresh(); }} className="text-sm text-muted hover:text-foreground">Scegli più tardi</button>
                <button
                  type="button"
                  onClick={confirmLogoChoice}
                  disabled={!selectedLogoChoice || confirmingLogo}
                  className="px-6 py-3 rounded-full font-bold bg-primary text-white hover:bg-primary-dark disabled:opacity-50 disabled:pointer-events-none transition-colors flex items-center gap-2"
                >
                  {confirmingLogo ? <Loader2 size={18} className="animate-spin" /> : null}
                  Conferma
                </button>
              </div>
            </div>
          </div>
        )}

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
