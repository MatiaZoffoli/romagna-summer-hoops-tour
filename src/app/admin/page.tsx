"use client";

import { useState, useRef } from "react";
import { Shield, Trophy, Plus, Newspaper, MapPin, Loader2, CheckCircle, Lock, FileText, X, Eye, Edit2, Copy, ImageIcon, Users, Share2, Award, Camera, Trash2 } from "lucide-react";
import { addTappaResult, updateTappaStatus, addTappa, updateTappaLogo, addNews, getAdminData, approveTappaApplication, rejectTappaApplication, approveTeamApplication, rejectTeamApplication, createSquadraAdmin, updateSquadraAdmin, deleteRisultatoAdmin, approveTeamChangeRequest, rejectTeamChangeRequest, sendTestEmail, approveSocialBonusRequest, rejectSocialBonusRequest, createMvp, updateMvp, deleteMvp, generateNewsForTappa, addGalleryPhoto, removeGalleryPhoto, addGalleryTappaImage, removeGalleryTappaImage } from "@/app/actions/admin";
import { sistemaPunteggio } from "@/data/placeholder";
import AckModal from "@/components/AckModal";
import { AVATAR_ICON_OPTIONS, AVATAR_COLOR_OPTIONS } from "@/lib/avatar-presets";

function NewsCaptionRow({ id, titolo, instagramCaption }: { id: string; titolo: string; instagramCaption: string | null }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    if (!instagramCaption?.trim()) return;
    try {
      await navigator.clipboard.writeText(instagramCaption.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  };
  return (
    <li className="flex items-center justify-between gap-4 p-3 bg-background rounded-xl border border-border">
      <span className="text-sm font-medium truncate flex-1">{titolo}</span>
      {instagramCaption?.trim() ? (
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border border-border hover:border-primary hover:text-primary transition-colors shrink-0"
        >
          {copied ? <CheckCircle size={14} /> : <Copy size={14} />}
          {copied ? "Copiato!" : "Copia caption"}
        </button>
      ) : (
        <span className="text-xs text-muted shrink-0">Nessuna bozza</span>
      )}
    </li>
  );
}

interface AdminData {
  tappe: { id: string; slug: string; nome: string; stato: string; logo_url: string | null; luogo: string; data: string; instagram: string | null }[];
  squadre: {
    id: string;
    nome: string;
    email: string | null;
    telefono: string | null;
    instagram: string | null;
    motto: string | null;
    auth_user_id: string | null;
    admin_notes: string | null;
    logo_url?: string | null;
    avatar_icon?: string | null;
    avatar_color?: string | null;
    giocatori?: { id: string; nome: string; cognome: string; ruolo: string | null; instagram: string | null }[];
  }[];
  risultati: { id: string; posizione: number; punti: number; tappa_id: string; squadra_id: string; tappe: { nome: string }; squadre: { nome: string } }[];
  news: { id: string; titolo: string; data: string; instagram_caption: string | null }[];
  teamChangeRequests: { id: string; squadra_id: string; stato: string; payload: Record<string, unknown>; created_at: string }[];
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
  teamApplications: {
    id: string;
    email: string;
    nome_squadra: string;
    motto: string | null;
    instagram: string | null;
    telefono: string | null;
    giocatori: { nome: string; cognome: string; ruolo?: string; instagram?: string }[];
    stato: string;
    created_at: string;
  }[];
  socialBonusRequests: {
    id: string;
    squadra_id: string;
    tappa_id: string;
    link_to_post: string | null;
    squadre: { nome: string } | null;
    tappe: { nome: string; slug: string } | null;
  }[];
  mvps: {
    id: string;
    tappa_id: string;
    nome: string;
    cognome: string;
    photo_url: string | null;
    bio: string | null;
    carriera: string | null;
    stats: Record<string, unknown>;
    ordine: number;
    tappe: { nome: string; slug: string } | null;
  }[];
  galleryPhotos: { id: string; tappa_id: string; instagram_post_url: string; ordine: number; created_at: string }[];
  galleryTappaImages: { id: string; tappa_id: string; image_url: string; ordine: number; created_at: string }[];
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [authenticated, setAuthenticated] = useState(false);
  const [data, setData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState<"risultati" | "tappe" | "news" | "stato" | "applicazioni" | "squadre" | "gestione-squadre" | "bonus-social" | "mvp" | "gallery">("risultati");
  const [previewApp, setPreviewApp] = useState<AdminData["applications"][0] | null>(null);
  const [editingApp, setEditingApp] = useState<AdminData["applications"][0] | null>(null);
  const [previewTeamApp, setPreviewTeamApp] = useState<AdminData["teamApplications"][0] | null>(null);
  const [editingTeamApp, setEditingTeamApp] = useState<AdminData["teamApplications"][0] | null>(null);
  const [editingSquadra, setEditingSquadra] = useState<AdminData["squadre"][0] | null>(null);
  const [showCreateSquadra, setShowCreateSquadra] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectDialog, setShowRejectDialog] = useState<string | null>(null);
  const [showRejectTeamDialog, setShowRejectTeamDialog] = useState<string | null>(null);
  const [rejectTeamReason, setRejectTeamReason] = useState("");
  const [editingChangeRequest, setEditingChangeRequest] = useState<AdminData["teamChangeRequests"][0] | null>(null);
  const [showRejectChangeRequest, setShowRejectChangeRequest] = useState<string | null>(null);
  const [rejectChangeRequestNote, setRejectChangeRequestNote] = useState("");
  const [editingMvp, setEditingMvp] = useState<AdminData["mvps"][0] | null>(null);
  const [showCreateMvp, setShowCreateMvp] = useState(false);
  const [testingEmail, setTestingEmail] = useState(false);

  async function handleLogin() {
    setLoading(true);
    setError("");
    const result = await getAdminData(password);
    if (result) {
      setData(result as AdminData);
      setAuthenticated(true);
    } else {
      setError("Password non valida.");
    }
    setLoading(false);
  }

  async function refreshData() {
    const result = await getAdminData(password);
    if (result) setData(result as AdminData);
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

  async function handleGenerateNewsForTappa(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    const result = await generateNewsForTappa(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("News generata e pubblicata per la tappa!");
      await refreshData();
    }
    setLoading(false);
  }

  async function handleAddGalleryPhoto(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    // If user pasted embed code, extract the post URL
    let url = (formData.get("instagramPostUrl") as string)?.trim() ?? "";
    const permalinkMatch = url.match(/data-instgrm-permalink=["']([^"']+)["']/);
    if (permalinkMatch?.[1]) {
      url = permalinkMatch[1].replace(/&amp;/g, "&").split("?")[0];
      formData.set("instagramPostUrl", url);
    }
    const result = await addGalleryPhoto(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Foto aggiunta alla gallery!");
      await refreshData();
      (e.target as HTMLFormElement).reset();
    }
    setLoading(false);
  }

  async function handleRemoveGalleryPhoto(galleryPhotoId: string) {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("galleryPhotoId", galleryPhotoId);
    const result = await removeGalleryPhoto(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Foto rimossa dalla gallery.");
      await refreshData();
    }
    setLoading(false);
  }

  async function handleAddGalleryTappaImage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      formData.set("adminPassword", password);
      const result = await addGalleryTappaImage(formData);
      if (result.error) {
        setError(result.error);
        return;
      }
      showMessage("Immagine aggiunta alla gallery.");
      await refreshData();
      (e.target as HTMLFormElement).reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Errore durante l'aggiunta.");
    } finally {
      setLoading(false);
    }
  }

  async function handleRemoveGalleryTappaImage(galleryTappaImageId: string) {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("galleryTappaImageId", galleryTappaImageId);
    const result = await removeGalleryTappaImage(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Immagine rimossa dalla gallery.");
      await refreshData();
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

  async function handleUpdateTappaLogo(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    formData.set("adminPassword", password);
    const result = await updateTappaLogo(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Logo aggiornato!");
      await refreshData();
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

  async function handleApproveTeamApplication(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    formData.set("adminPassword", password);
    formData.set("applicationId", editingTeamApp?.id || "");
    formData.set("email", (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? editingTeamApp?.email ?? "");
    formData.set("nome_squadra", (form.querySelector('[name="nome_squadra"]') as HTMLInputElement)?.value ?? editingTeamApp?.nome_squadra ?? "");
    formData.set("motto", (form.querySelector('[name="motto"]') as HTMLInputElement)?.value ?? "");
    formData.set("instagram", (form.querySelector('[name="instagram"]') as HTMLInputElement)?.value ?? "");
    formData.set("telefono", (form.querySelector('[name="telefono"]') as HTMLInputElement)?.value ?? "");
    const giocatoriEl = form.querySelector('[name="giocatori"]') as HTMLTextAreaElement;
    formData.set("giocatori", giocatoriEl?.value ? giocatoriEl.value : JSON.stringify(editingTeamApp?.giocatori ?? []));
    const result = await approveTeamApplication(formData);
    if (result.error) setError(result.error);
    else {
      showMessage(
        result.emailSent === false
          ? "Squadra approvata. Attenzione: l'email di benvenuto non è stata inviata (controlla configurazione SES o indirizzo)."
          : "Squadra approvata!"
      );
      setEditingTeamApp(null);
      await refreshData();
    }
    setLoading(false);
  }

  async function handleRejectTeamApplication(applicationId: string, reason?: string) {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("applicationId", applicationId);
    if (reason) formData.set("reason", reason);
    const result = await rejectTeamApplication(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Richiesta squadra rifiutata.");
      setShowRejectTeamDialog(null);
      setRejectTeamReason("");
      await refreshData();
    }
    setLoading(false);
  }

  function getSquadraStats(squadraId: string) {
    if (!data?.risultati) return { tappe_giocate: 0, punti_totali: 0 };
    const ris = data.risultati.filter((r: { squadra_id: string }) => r.squadra_id === squadraId);
    const punti_totali = ris.reduce((s: number, r: { punti: number }) => s + r.punti, 0);
    return { tappe_giocate: ris.length, punti_totali };
  }

  function hasPendingChangeRequest(squadraId: string) {
    return data?.teamChangeRequests?.some((r) => r.squadra_id === squadraId && r.stato === "pending") ?? false;
  }

  function normalizeSquadraName(name: string): string {
    return String(name ?? "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  }

  function findDuplicateSquadraName(name: string, excludeId?: string): { nome: string } | null {
    const norm = normalizeSquadraName(name);
    if (!norm) return null;
    const other = data?.squadre?.find(
      (s) => s.id !== excludeId && normalizeSquadraName(s.nome) === norm
    );
    return other ? { nome: other.nome } : null;
  }

  const [duplicateWarning, setDuplicateWarning] = useState<{ otherName: string } | null>(null);
  const [forceDuplicateOk, setForceDuplicateOk] = useState(false);
  const createSquadraFormRef = useRef<HTMLFormElement>(null);
  const editSquadraFormRef = useRef<HTMLFormElement>(null);

  async function handleCreateSquadra(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const force = formData.get("force_duplicate") === "1";
    const nome = (form.querySelector('[name="nome"]') as HTMLInputElement)?.value?.trim() ?? "";
    const duplicate = findDuplicateSquadraName(nome);
    if (duplicate && !force) {
      setDuplicateWarning({ otherName: duplicate.nome });
      return;
    }
    setDuplicateWarning(null);
    setForceDuplicateOk(false);
    setError("");
    setLoading(true);
    formData.set("adminPassword", password);
    const result = await createSquadraAdmin(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Squadra creata!");
      setShowCreateSquadra(false);
      form.reset();
      await refreshData();
    }
    setLoading(false);
  }

  async function handleUpdateSquadra(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!editingSquadra) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const force = formData.get("force_duplicate") === "1";
    const nome = (form.querySelector('[name="nome"]') as HTMLInputElement)?.value?.trim() ?? "";
    const duplicate = findDuplicateSquadraName(nome, editingSquadra.id);
    if (duplicate && !force) {
      setDuplicateWarning({ otherName: duplicate.nome });
      return;
    }
    setDuplicateWarning(null);
    setForceDuplicateOk(false);
    setError("");
    setLoading(true);
    formData.set("adminPassword", password);
    formData.set("squadraId", editingSquadra.id);
    formData.set("nome", nome || editingSquadra.nome);
    formData.set("email", (form.querySelector('[name="email"]') as HTMLInputElement)?.value ?? "");
    formData.set("telefono", (form.querySelector('[name="telefono"]') as HTMLInputElement)?.value ?? "");
    formData.set("instagram", (form.querySelector('[name="instagram"]') as HTMLInputElement)?.value ?? "");
    formData.set("motto", (form.querySelector('[name="motto"]') as HTMLInputElement)?.value ?? "");
    formData.set("admin_notes", (form.querySelector('[name="admin_notes"]') as HTMLInputElement)?.value ?? "");
    const giocatoriEl = form.querySelector('[name="giocatori"]') as HTMLTextAreaElement;
    formData.set("giocatori", giocatoriEl?.value ?? JSON.stringify(editingSquadra.giocatori ?? [], null, 2));
    const result = await updateSquadraAdmin(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Squadra aggiornata!");
      setEditingSquadra(null);
      await refreshData();
    }
    setLoading(false);
  }

  async function handleDeleteRisultato(risultatoId: string) {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("risultatoId", risultatoId);
    const result = await deleteRisultatoAdmin(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Risultato eliminato.");
      await refreshData();
    }
    setLoading(false);
  }

  async function handleApproveTeamChangeRequest(e: React.FormEvent<HTMLFormElement> | null, requestId: string, payloadJson?: string) {
    e?.preventDefault();
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("requestId", requestId);
    if (payloadJson) formData.set("payload", payloadJson);
    const result = await approveTeamChangeRequest(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Richiesta di modifica approvata.");
      setEditingChangeRequest(null);
      await refreshData();
    }
    setLoading(false);
  }

  async function handleRejectTeamChangeRequest(requestId: string, note?: string) {
    setError("");
    setLoading(true);
    const formData = new FormData();
    formData.set("adminPassword", password);
    formData.set("requestId", requestId);
    if (note) formData.set("admin_notes", note);
    const result = await rejectTeamChangeRequest(formData);
    if (result.error) setError(result.error);
    else {
      showMessage("Richiesta di modifica rifiutata.");
      setShowRejectChangeRequest(null);
      setRejectChangeRequestNote("");
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
              {data?.squadre.length} squadre · {data?.tappe.length} tappe · {data?.risultati.length} risultati · {data?.applications.filter(a => a.stato === 'pending').length || 0} tappe in attesa · {data?.teamApplications.filter(t => t.stato === 'pending').length || 0} squadre in attesa
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
            { id: "gallery" as const, label: "Gallery", icon: Camera },
            { id: "applicazioni" as const, label: `Tappe${data?.applications.filter(a => a.stato === 'pending').length ? ` (${data.applications.filter(a => a.stato === 'pending').length})` : ''}`, icon: FileText },
            { id: "squadre" as const, label: `Richieste squadre${data?.teamApplications.filter(t => t.stato === 'pending').length ? ` (${data.teamApplications.filter(t => t.stato === 'pending').length})` : ''}`, icon: Users },
            { id: "gestione-squadre" as const, label: "Gestione squadre", icon: Users },
            { id: "bonus-social" as const, label: `Bonus social${data?.socialBonusRequests?.length ? ` (${data.socialBonusRequests.length})` : ""}`, icon: Share2 },
            { id: "mvp" as const, label: "MVP", icon: Award },
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
                  <div>
                    <label className="block text-sm text-muted mb-2">Partite giocate (opz.)</label>
                    <input name="partite_giocate" type="number" min="0" placeholder="Es: 5" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Partite vinte (opz.)</label>
                    <input name="partite_vinte" type="number" min="0" placeholder="Es: 3" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Punti fatti (opz.)</label>
                    <input name="punti_fatti" type="number" min="0" placeholder="Es: 85" className={inputClass} />
                  </div>
                  <div>
                    <label className="block text-sm text-muted mb-2">Punti subiti (opz.)</label>
                    <input name="punti_subiti" type="number" min="0" placeholder="Es: 72" className={inputClass} />
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

            <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mt-10 mb-4">
              LOGO TAPPE
            </h3>
            <p className="text-sm text-muted mb-4">Stesso logo mostrato sulla mappa e nella pagina tappa. URL o carica immagine.</p>
            <div className="space-y-4">
              {data?.tappe.map((t) => (
                <form key={`logo-${t.id}`} onSubmit={handleUpdateTappaLogo} className="flex flex-wrap items-center gap-4 p-4 bg-background rounded-xl border border-border">
                  <input type="hidden" name="tappaId" value={t.id} />
                  {t.logo_url ? (
                    <div className="w-14 h-14 rounded-lg overflow-hidden border border-border shrink-0 bg-surface">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.logo_url} alt="" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-lg border border-dashed border-border flex items-center justify-center shrink-0">
                      <ImageIcon size={20} className="text-muted" />
                    </div>
                  )}
                  <span className="font-semibold text-foreground min-w-[100px]">{t.nome}</span>
                  <input name="logoUrl" type="url" placeholder="URL logo" defaultValue={t.logo_url ?? ""} className="flex-1 min-w-[180px] px-3 py-2 bg-surface border border-border rounded-lg text-sm" />
                  <input name="logo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="text-sm text-muted file:mr-2 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:bg-primary file:text-white file:text-xs" />
                  <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors disabled:opacity-50">
                    Salva logo
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
                  <label className="block text-sm text-muted mb-2">Latitudine (mappa)</label>
                  <input name="lat" type="number" step="any" placeholder="Es: 44.199" className={inputClass} />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Longitudine (mappa)</label>
                  <input name="lng" type="number" step="any" placeholder="Es: 12.405" className={inputClass} />
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
                <div className="sm:col-span-2">
                  <label className="block text-sm text-muted mb-2">Logo tappa (URL)</label>
                  <input name="logoUrl" type="url" placeholder="https://..." className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm text-muted mb-2">Oppure carica immagine</label>
                  <input name="logo" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white file:text-sm" />
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

            {/* Genera news per tappa esistente - in evidenza in cima */}
            <div className="mb-10 pb-8 border-b border-border">
              <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">
                GENERA NEWS PER UNA TAPPA ESISTENTE
              </h3>
              <p className="text-sm text-muted mb-4">
                Se hai aggiunto una tappa manualmente senza che venisse creata la news, seleziona la tappa e genera l&apos;articolo in automatico (richiede OPENAI_API_KEY).
              </p>
              <form onSubmit={handleGenerateNewsForTappa} className="flex flex-wrap items-end gap-4">
                <div className="min-w-[200px]">
                  <label className="block text-sm text-muted mb-2">Tappa</label>
                  <select name="tappaId" required className={inputClass}>
                    <option value="">Seleziona tappa...</option>
                    {data?.tappe.map((t) => (
                      <option key={t.id} value={t.id}>{t.nome} – {t.luogo} ({t.data})</option>
                    ))}
                  </select>
                </div>
                <button type="submit" disabled={loading || !data?.tappe?.length} className="px-5 py-2.5 bg-primary/90 text-white font-semibold rounded-full hover:bg-primary transition-colors flex items-center gap-2 disabled:opacity-50">
                  {loading ? <Loader2 size={16} className="animate-spin" /> : <Newspaper size={16} />}
                  Genera news per questa tappa
                </button>
              </form>
            </div>

            <h3 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider mb-4 text-muted">
              Oppure pubblica una news manuale
            </h3>
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
              <div>
                <label className="block text-sm text-muted mb-2 flex items-center gap-2">
                  <ImageIcon size={14} /> Immagine (URL opzionale)
                </label>
                <input name="image_url" type="url" placeholder="https://..." className={inputClass} />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Bozza caption Instagram (opzionale)</label>
                <textarea
                  name="instagram_caption"
                  rows={4}
                  placeholder="Testo da copiare nel post Instagram..."
                  className={inputClass}
                  maxLength={2200}
                />
                <p className="text-xs text-muted mt-1">
                  Limite Instagram: 2.200 caratteri. Usa &quot;Copia caption&quot; dopo aver pubblicato la news.
                </p>
              </div>
              <button type="submit" disabled={loading} className="px-6 py-3 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50">
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Newspaper size={16} />}
                Pubblica News
              </button>
            </form>

            {data?.news && data.news.length > 0 && (
              <div className="mt-8 pt-8 border-t border-border">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4">
                  COPIA CAPTION (ultime news)
                </h3>
                <ul className="space-y-3">
                  {data.news.slice(0, 5).map((n) => (
                    <NewsCaptionRow key={n.id} id={n.id} titolo={n.titolo} instagramCaption={n.instagram_caption ?? null} />
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* ===== GALLERY (foto Instagram per tappa) ===== */}
        {activeTab === "gallery" && (
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-2">
              GALLERY – FOTO PER TAPPA
            </h2>

            {/* Immagini caricate (max 3 per tappa) – mostrate come quadrati uniformi */}
            <div className="mb-10">
              <h3 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider mb-2 text-primary">
                IMMAGINI CARICATE (max 3 per tappa)
              </h3>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
                  {error}
                </div>
              )}
              <p className="text-sm text-muted mb-6">
                Carica fino a 3 immagini per ogni tappa. Verranno mostrate nella pagina Gallery come quadrati uniformi (ritaglio al centro). Puoi caricare un file o incollare l&apos;URL di un&apos;immagine.
              </p>
              <div className="space-y-8">
                {data?.tappe.map((tappa) => {
                  const images = (data?.galleryTappaImages ?? []).filter((img) => img.tappa_id === tappa.id).sort((a, b) => a.ordine - b.ordine);
                  const canAddImage = images.length < 3;
                  return (
                    <div key={tappa.id} className="p-6 bg-background rounded-xl border border-border">
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <h4 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">{tappa.nome}</h4>
                          <p className="text-xs text-muted">{tappa.luogo}</p>
                        </div>
                        <span className="text-sm text-muted shrink-0">{images.length}/3 immagini</span>
                      </div>
                      {images.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-4">
                          {images.map((img) => (
                            <div key={img.id} className="relative group">
                              <img src={img.image_url} alt="" className="w-24 h-24 object-cover rounded-lg border border-border" />
                              <button
                                type="button"
                                disabled={loading}
                                onClick={() => handleRemoveGalleryTappaImage(img.id)}
                                className="absolute -top-1 -right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
                                title="Rimuovi"
                              >
                                <Trash2 size={12} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                      {canAddImage && (
                        <form onSubmit={handleAddGalleryTappaImage} className="flex flex-wrap items-end gap-3">
                          <input type="hidden" name="tappaId" value={tappa.id} />
                          <div className="flex-1 min-w-[200px]">
                            <label className="block text-xs text-muted mb-1">URL immagine (opzionale se carichi un file)</label>
                            <input
                              name="imageUrl"
                              type="url"
                              placeholder="https://..."
                              className={inputClass}
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-muted mb-1">Oppure carica file</label>
                            <input name="image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="text-sm" />
                          </div>
                          <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50">
                            {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                            Aggiungi immagine
                          </button>
                        </form>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <h3 className="font-[family-name:var(--font-bebas)] text-lg tracking-wider mb-2 text-muted">
              POST INSTAGRAM (embed – opzionale)
            </h3>
            <p className="text-sm text-muted mb-6">
              Aggiungi fino a 5 post Instagram per ogni tappa. Inserisci l&apos;URL del post (es. https://www.instagram.com/p/ABC123/) oppure incolla il codice embed di Instagram (blockquote). Le foto appariranno nella pagina Gallery con anteprima.
            </p>
            <div className="space-y-8">
              {data?.tappe.map((tappa) => {
                const photos = (data?.galleryPhotos ?? []).filter((p) => p.tappa_id === tappa.id);
                const canAdd = photos.length < 5;
                return (
                  <div key={tappa.id} className="p-6 bg-background rounded-xl border border-border">
                    <div className="flex items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">{tappa.nome}</h3>
                        <p className="text-xs text-muted">{tappa.luogo} {tappa.instagram ? `· ${tappa.instagram}` : ""}</p>
                      </div>
                      <span className="text-sm text-muted shrink-0">{photos.length}/5 foto</span>
                    </div>
                    {photos.length > 0 && (
                      <ul className="space-y-2 mb-4">
                        {photos.sort((a, b) => a.ordine - b.ordine).map((p) => (
                          <li key={p.id} className="flex items-center justify-between gap-2 p-2 rounded-lg bg-surface border border-border">
                            <a href={p.instagram_post_url} target="_blank" rel="noopener noreferrer" className="text-sm text-primary truncate flex-1 hover:underline">
                              {p.instagram_post_url}
                            </a>
                            <button
                              type="button"
                              disabled={loading}
                              onClick={() => handleRemoveGalleryPhoto(p.id)}
                              className="p-1.5 text-red-400 hover:bg-red-400/10 rounded-lg transition-colors disabled:opacity-50 shrink-0"
                              title="Rimuovi"
                            >
                              <Trash2 size={16} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                    {canAdd && (
                      <form onSubmit={handleAddGalleryPhoto} className="flex flex-wrap items-end gap-3">
                        <input type="hidden" name="tappaId" value={tappa.id} />
                        <div className="flex-1 min-w-[200px]">
                          <label className="block text-xs text-muted mb-1">URL post Instagram o codice embed</label>
                          <input
                            name="instagramPostUrl"
                            type="text"
                            placeholder="https://www.instagram.com/p/... oppure incolla il codice embed"
                            className={inputClass}
                            required
                          />
                        </div>
                        <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white text-sm font-semibold rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2 disabled:opacity-50">
                          {loading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                          Aggiungi
                        </button>
                      </form>
                    )}
                  </div>
                );
              })}
            </div>
            {(!data?.tappe || data.tappe.length === 0) && (
              <p className="text-muted text-sm">Nessuna tappa. Aggiungi prima una tappa dalla tab Nuova Tappa.</p>
            )}
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

        {/* ===== RICHIESTE SQUADRE ===== */}
        {activeTab === "squadre" && (
          <div className="space-y-6">
            {/* Preview modal */}
            {previewTeamApp && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">ANTEPRIMA RICHIESTA SQUADRA</h2>
                    <button onClick={() => setPreviewTeamApp(null)} className="p-2 hover:bg-background rounded-lg transition-colors"><X size={20} /></button>
                  </div>
                  <div className="p-6 space-y-4">
                    <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">{previewTeamApp.nome_squadra}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                      <div><span className="text-muted">Email:</span> <a href={`mailto:${previewTeamApp.email}`} className="text-primary hover:text-gold">{previewTeamApp.email}</a></div>
                      {previewTeamApp.telefono && <div><span className="text-muted">Telefono:</span> <span className="text-foreground">{previewTeamApp.telefono}</span></div>}
                      {previewTeamApp.instagram && <div><span className="text-muted">Instagram:</span> <span className="text-foreground">{previewTeamApp.instagram}</span></div>}
                      {previewTeamApp.motto && <div className="sm:col-span-2"><span className="text-muted">Motto:</span> <span className="text-foreground italic">&quot;{previewTeamApp.motto}&quot;</span></div>}
                    </div>
                    <div>
                      <p className="text-xs text-muted mb-2">Giocatori ({previewTeamApp.giocatori?.length ?? 0})</p>
                      <ul className="space-y-1 text-sm">
                        {(previewTeamApp.giocatori || []).map((g: { nome: string; cognome: string; ruolo?: string }, i: number) => (
                          <li key={i}>{g.nome} {g.cognome}{g.ruolo ? ` · ${g.ruolo}` : ""}</li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-4 border-t border-border flex gap-3">
                      <button onClick={() => { setPreviewTeamApp(null); setEditingTeamApp(previewTeamApp); }} className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2">
                        <Edit2 size={14} /> Modifica e Approva
                      </button>
                      <button onClick={() => setPreviewTeamApp(null)} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors">Chiudi</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Edit & Approve modal */}
            {editingTeamApp && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">MODIFICA E APPROVA SQUADRA</h2>
                    <button onClick={() => setEditingTeamApp(null)} className="p-2 hover:bg-background rounded-lg transition-colors"><X size={20} /></button>
                  </div>
                  <form onSubmit={handleApproveTeamApplication} className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">Collega a squadra esistente (senza account)</label>
                      <select name="link_to_squadra_id" className={inputClass}>
                        <option value="">Crea nuova squadra</option>
                        {data?.squadre?.filter((s) => !s.auth_user_id).map((s) => (
                          <option key={s.id} value={s.id}>{s.nome}</option>
                        ))}
                      </select>
                      <p className="text-xs text-muted mt-1">Se scegli una squadra, l&apos;account verrà collegato a quella squadra invece di crearne una nuova.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div><label className="block text-sm text-muted mb-2">Email *</label><input name="email" type="email" defaultValue={editingTeamApp.email} required className={inputClass} /></div>
                      <div><label className="block text-sm text-muted mb-2">Nome squadra *</label><input name="nome_squadra" defaultValue={editingTeamApp.nome_squadra} required className={inputClass} /></div>
                      <div><label className="block text-sm text-muted mb-2">Telefono</label><input name="telefono" defaultValue={editingTeamApp.telefono || ""} className={inputClass} /></div>
                      <div><label className="block text-sm text-muted mb-2">Instagram</label><input name="instagram" defaultValue={editingTeamApp.instagram || ""} className={inputClass} /></div>
                      <div className="sm:col-span-2"><label className="block text-sm text-muted mb-2">Motto</label><input name="motto" defaultValue={editingTeamApp.motto || ""} className={inputClass} /></div>
                    </div>
                    <div>
                      <label className="block text-sm text-muted mb-2">Giocatori (JSON)</label>
                      <textarea name="giocatori" rows={8} defaultValue={JSON.stringify(editingTeamApp.giocatori || [], null, 2)} className={inputClass} />
                    </div>
                    <div className="pt-4 border-t border-border flex gap-3">
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approva Squadra
                      </button>
                      <button type="button" onClick={() => setEditingTeamApp(null)} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors">Annulla</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Reject team dialog */}
            {showRejectTeamDialog && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-md w-full">
                  <div className="p-6 border-b border-border"><h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">RIFIUTA RICHIESTA SQUADRA</h2></div>
                  <div className="p-6 space-y-4">
                    <div>
                      <label className="block text-sm text-muted mb-2">Motivo del rifiuto (opzionale)</label>
                      <textarea value={rejectTeamReason} onChange={(e) => setRejectTeamReason(e.target.value)} rows={4} placeholder="Inserisci un motivo..." className={inputClass} />
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => handleRejectTeamApplication(showRejectTeamDialog, rejectTeamReason)} disabled={loading} className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors flex items-center gap-2 disabled:opacity-50">
                        {loading ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />} Conferma Rifiuto
                      </button>
                      <button onClick={() => { setShowRejectTeamDialog(null); setRejectTeamReason(""); }} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors">Annulla</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Pending team applications */}
            {data && data.teamApplications.filter(t => t.stato === "pending").length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-4">IN ATTESA DI APPROVAZIONE</h2>
                <div className="space-y-4">
                  {data.teamApplications.filter(t => t.stato === "pending").map((app) => (
                    <div key={app.id} className="p-6 bg-surface rounded-2xl border border-border">
                      <div className="flex items-start justify-between gap-4 mb-4">
                        <div className="flex-1">
                          <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-2">{app.nome_squadra}</h3>
                          <a href={`mailto:${app.email}`} className="text-sm text-primary hover:text-gold">{app.email}</a>
                        </div>
                        <span className="px-3 py-1 bg-yellow-500/20 text-yellow-400 text-xs font-semibold rounded-full border border-yellow-500/30">IN ATTESA</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-4">
                        {app.telefono && <div><span className="text-muted">Telefono:</span> <span className="text-foreground">{app.telefono}</span></div>}
                        {app.instagram && <div><span className="text-muted">Instagram:</span> <span className="text-foreground">{app.instagram}</span></div>}
                        <div><span className="text-muted">Giocatori:</span> <span className="text-foreground">{app.giocatori?.length ?? 0}</span></div>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => setPreviewTeamApp(app)} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background transition-colors flex items-center gap-2"><Eye size={14} /> Anteprima</button>
                        <button onClick={() => setEditingTeamApp(app)} className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"><Edit2 size={14} /> Modifica e Approva</button>
                        <button onClick={() => setShowRejectTeamDialog(app.id)} className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"><X size={14} /> Rifiuta</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Approved / Rejected team applications */}
            {data && data.teamApplications.filter(t => t.stato === "approved").length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-green-400">APPROVATE</h2>
                <div className="space-y-2">
                  {data.teamApplications.filter(t => t.stato === "approved").map((app) => (
                    <div key={app.id} className="p-4 bg-surface rounded-xl border border-green-500/20 flex items-center justify-between">
                      <div><span className="font-medium">{app.nome_squadra}</span><span className="text-xs text-muted ml-2">{app.email}</span></div>
                      <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">Approvata</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {data && data.teamApplications.filter(t => t.stato === "rejected").length > 0 && (
              <div>
                <h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-red-400">RIFIUTATE</h2>
                <div className="space-y-2">
                  {data.teamApplications.filter(t => t.stato === "rejected").map((app) => (
                    <div key={app.id} className="p-4 bg-surface rounded-xl border border-red-500/20 flex items-center justify-between">
                      <div><span className="font-medium">{app.nome_squadra}</span><span className="text-xs text-muted ml-2">{app.email}</span></div>
                      <span className="px-2 py-1 bg-red-500/20 text-red-400 text-xs rounded-full">Rifiutata</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {data && data.teamApplications.length === 0 && (
              <div className="p-12 bg-surface rounded-2xl border border-dashed border-border text-center">
                <Users size={48} className="mx-auto mb-4 text-primary/30" />
                <p className="text-muted">Nessuna richiesta squadra ancora.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== GESTIONE SQUADRE ===== */}
        {activeTab === "gestione-squadre" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">Tutte le squadre</h2>
              <button
                type="button"
                onClick={() => setShowCreateSquadra(true)}
                className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <Plus size={14} /> Aggiungi squadra
              </button>
            </div>

            {/* Pending change requests */}
            {data?.teamChangeRequests?.filter((r) => r.stato === "pending").length ? (
              <div className="p-6 bg-surface rounded-2xl border border-yellow-500/30">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4 text-yellow-400">Richieste di modifica in attesa</h3>
                <div className="space-y-3">
                  {data.teamChangeRequests.filter((r) => r.stato === "pending").map((req) => {
                    const sq = data.squadre.find((s) => s.id === req.squadra_id);
                    const payload = (req.payload || {}) as { nome?: string; motto?: string; instagram?: string; telefono?: string; giocatori?: unknown[] };
                    return (
                      <div key={req.id} className="p-4 bg-background rounded-xl border border-border flex flex-wrap items-center justify-between gap-4">
                        <div>
                          <span className="font-medium">{sq?.nome ?? req.squadra_id}</span>
                          <p className="text-sm text-muted mt-1">Richiesto: {payload.nome ?? "—"} · {Array.isArray(payload.giocatori) ? payload.giocatori.length : 0} giocatori</p>
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => setEditingChangeRequest(req)} className="px-3 py-1.5 bg-primary text-white text-sm rounded-full hover:bg-primary-dark flex items-center gap-1"><Edit2 size={12} /> Modifica e approva</button>
                          <button onClick={() => handleApproveTeamChangeRequest(null, req.id)} disabled={loading} className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 disabled:opacity-50">Approva</button>
                          <button onClick={() => setShowRejectChangeRequest(req.id)} className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600">Rifiuta</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {/* Edit change request (modify and approve) modal */}
            {editingChangeRequest && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">Modifica e approva richiesta</h2>
                    <button onClick={() => setEditingChangeRequest(null)} className="p-2 hover:bg-background rounded-lg"><X size={20} /></button>
                  </div>
                  <form onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.currentTarget;
                    const payloadEl = form.querySelector('[name="payload"]') as HTMLTextAreaElement;
                    handleApproveTeamChangeRequest(e, editingChangeRequest.id, payloadEl?.value);
                  }} className="p-6 space-y-4">
                    <div><label className="block text-sm text-muted mb-2">Payload (nome, motto, instagram, telefono, giocatori)</label><textarea name="payload" rows={12} defaultValue={JSON.stringify(editingChangeRequest.payload || {}, null, 2)} className={inputClass} /></div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 disabled:opacity-50 flex items-center gap-2">{loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Approva</button>
                      <button type="button" onClick={() => setEditingChangeRequest(null)} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full">Annulla</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Reject change request dialog */}
            {showRejectChangeRequest && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-md w-full">
                  <div className="p-6 border-b border-border"><h2 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider">Rifiuta richiesta di modifica</h2></div>
                  <div className="p-6 space-y-4">
                    <div><label className="block text-sm text-muted mb-2">Note (opzionale)</label><textarea value={rejectChangeRequestNote} onChange={(e) => setRejectChangeRequestNote(e.target.value)} rows={3} className={inputClass} /></div>
                    <div className="flex gap-3">
                      <button onClick={() => handleRejectTeamChangeRequest(showRejectChangeRequest, rejectChangeRequestNote)} disabled={loading} className="px-4 py-2 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 disabled:opacity-50">Conferma rifiuto</button>
                      <button onClick={() => { setShowRejectChangeRequest(null); setRejectChangeRequestNote(""); }} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full">Annulla</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Create squadra modal */}
            {showCreateSquadra && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">Crea squadra</h2>
                    <button onClick={() => { setShowCreateSquadra(false); setDuplicateWarning(null); }} className="p-2 hover:bg-background rounded-lg"><X size={20} /></button>
                  </div>
                  <form ref={createSquadraFormRef} onSubmit={handleCreateSquadra} className="p-6 space-y-4">
                    <input type="hidden" name="force_duplicate" value={forceDuplicateOk ? "1" : ""} readOnly />
                    {duplicateWarning && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm">
                        <p className="text-yellow-400 font-medium">Attenzione: esiste già una squadra con nome simile: {duplicateWarning.otherName}</p>
                        <button type="button" onClick={() => { setForceDuplicateOk(true); setTimeout(() => createSquadraFormRef.current?.requestSubmit(), 0); }} className="mt-2 text-yellow-400 hover:text-yellow-300 underline">Salva comunque</button>
                      </div>
                    )}
                    <div><label className="block text-sm text-muted mb-2">Nome *</label><input name="nome" required className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Email</label><input name="email" type="email" className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Telefono</label><input name="telefono" className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Instagram</label><input name="instagram" className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Motto</label><input name="motto" className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Note admin</label><input name="admin_notes" className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">URL logo</label><input name="logo_url" type="url" placeholder="https://..." className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm text-muted mb-2">Icona avatar</label><select name="avatar_icon" className={inputClass}><option value="">Nessuna</option>{AVATAR_ICON_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></div>
                      <div><label className="block text-sm text-muted mb-2">Colore avatar</label><select name="avatar_color" className={inputClass}><option value="">Predefinito</option>{AVATAR_COLOR_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></div>
                    </div>
                    <div><label className="block text-sm text-muted mb-2">Giocatori (JSON opzionale)</label><textarea name="giocatori" rows={6} placeholder='[{"nome":"","cognome":"","ruolo":"","instagram":""}]' className={inputClass} /></div>
                    <div className="flex gap-3">
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 disabled:opacity-50 flex items-center gap-2">{loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Crea</button>
                      <button type="button" onClick={() => { setShowCreateSquadra(false); setDuplicateWarning(null); }} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full">Annulla</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Edit squadra modal */}
            {editingSquadra && (
              <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-surface rounded-2xl border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <div className="p-6 border-b border-border flex items-center justify-between">
                    <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">Modifica squadra</h2>
                    <button onClick={() => { setEditingSquadra(null); setDuplicateWarning(null); }} className="p-2 hover:bg-background rounded-lg"><X size={20} /></button>
                  </div>
                  <form ref={editSquadraFormRef} onSubmit={handleUpdateSquadra} className="p-6 space-y-4">
                    <input type="hidden" name="force_duplicate" value={forceDuplicateOk ? "1" : ""} readOnly />
                    {duplicateWarning && (
                      <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl text-sm">
                        <p className="text-yellow-400 font-medium">Attenzione: esiste già una squadra con nome simile: {duplicateWarning.otherName}</p>
                        <button type="button" onClick={() => { setForceDuplicateOk(true); setTimeout(() => editSquadraFormRef.current?.requestSubmit(), 0); }} className="mt-2 text-yellow-400 hover:text-yellow-300 underline">Salva comunque</button>
                      </div>
                    )}
                    <div><label className="block text-sm text-muted mb-2">Nome *</label><input name="nome" defaultValue={editingSquadra.nome} required className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Email</label><input name="email" type="email" defaultValue={editingSquadra.email ?? ""} className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Telefono</label><input name="telefono" defaultValue={editingSquadra.telefono ?? ""} className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Instagram</label><input name="instagram" defaultValue={editingSquadra.instagram ?? ""} className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Motto</label><input name="motto" defaultValue={editingSquadra.motto ?? ""} className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Note admin</label><input name="admin_notes" defaultValue={editingSquadra.admin_notes ?? ""} className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">URL logo</label><input name="logo_url" type="url" defaultValue={editingSquadra.logo_url ?? ""} placeholder="https://..." className={inputClass} /></div>
                    <div className="grid grid-cols-2 gap-4">
                      <div><label className="block text-sm text-muted mb-2">Icona avatar</label><select name="avatar_icon" className={inputClass} defaultValue={editingSquadra.avatar_icon ?? ""}><option value="">Nessuna</option>{AVATAR_ICON_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></div>
                      <div><label className="block text-sm text-muted mb-2">Colore avatar</label><select name="avatar_color" className={inputClass} defaultValue={editingSquadra.avatar_color ?? ""}><option value="">Predefinito</option>{AVATAR_COLOR_OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}</select></div>
                    </div>
                    <div><label className="block text-sm text-muted mb-2">Giocatori (JSON)</label><textarea name="giocatori" rows={8} defaultValue={JSON.stringify(editingSquadra.giocatori ?? [], null, 2)} className={inputClass} /></div>
                    <div className="border-t border-border pt-4">
                      <p className="text-xs text-muted mb-2">Risultati</p>
                      {data?.risultati.filter((r: { squadra_id: string }) => r.squadra_id === editingSquadra.id).map((r: { id: string; posizione: number; punti: number; tappe: { nome: string } }) => (
                        <div key={r.id} className="flex items-center justify-between py-2 border-b border-border/50 text-sm">
                          <span>{r.tappe?.nome} — {r.posizione}° · {r.punti} pt</span>
                          <button type="button" onClick={() => handleDeleteRisultato(r.id)} className="text-red-400 hover:text-red-300 text-xs">Elimina</button>
                        </div>
                      ))}
                      {(!data?.risultati?.length || data.risultati.filter((r: { squadra_id: string }) => r.squadra_id === editingSquadra.id).length === 0) && <p className="text-muted text-sm">Nessun risultato</p>}
                    </div>
                    <div className="flex gap-3 pt-4">
                      <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark disabled:opacity-50 flex items-center gap-2">{loading ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />} Salva</button>
                      <button type="button" onClick={() => { setEditingSquadra(null); setDuplicateWarning(null); }} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full">Chiudi</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Squadre list */}
            {data && data.squadre.length > 0 && (
              <div className="space-y-3">
                {data.squadre.map((sq) => {
                  const stats = getSquadraStats(sq.id);
                  const pendingChange = hasPendingChangeRequest(sq.id);
                  return (
                    <div key={sq.id} className="p-4 bg-surface rounded-xl border border-border flex flex-wrap items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium">{sq.nome}</span>
                          {!sq.auth_user_id && <span className="px-2 py-0.5 bg-muted/30 text-muted text-xs rounded-full">Non collegata</span>}
                          {pendingChange && <span className="px-2 py-0.5 bg-yellow-500/20 text-yellow-400 text-xs rounded-full">Richiesta modifica</span>}
                        </div>
                        <p className="text-sm text-muted mt-1">{sq.email ?? "—"}</p>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted">
                        <span>{stats.tappe_giocate} tappe</span>
                        <span>{stats.punti_totali} pt</span>
                      </div>
                      <button onClick={() => setEditingSquadra(sq)} className="px-4 py-2 bg-surface border border-border text-foreground text-sm rounded-full hover:bg-background flex items-center gap-2">
                        <Edit2 size={14} /> Modifica
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
            {data && data.squadre.length === 0 && (
              <div className="p-12 bg-surface rounded-2xl border border-dashed border-border text-center">
                <Users size={48} className="mx-auto mb-4 text-primary/30" />
                <p className="text-muted">Nessuna squadra. Aggiungi una squadra o approva richieste dal tab Richieste squadre.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== BONUS SOCIAL ===== */}
        {activeTab === "bonus-social" && (
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider mb-2">Richieste bonus social (+5 pt)</h2>
            <p className="text-sm text-muted mb-6">Le squadre richiedono il bonus per aver condiviso il template sui social. Approva per assegnare +5 punti per quella tappa.</p>
            {data?.socialBonusRequests?.length ? (
              <div className="space-y-3">
                {data.socialBonusRequests.map((req) => (
                  <div key={req.id} className="p-4 bg-background rounded-xl border border-border flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <span className="font-medium">{(req.squadre as { nome: string } | null)?.nome ?? req.squadra_id}</span>
                      <span className="text-muted mx-2">—</span>
                      <span className="text-muted">{(req.tappe as { nome: string } | null)?.nome ?? req.tappa_id}</span>
                      {req.link_to_post && (
                        <p className="text-sm mt-1">
                          <a href={req.link_to_post} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-gold break-all">{req.link_to_post}</a>
                        </p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <form action={async (fd) => { const r = await approveSocialBonusRequest(fd); if (r?.error) setError(r.error); else { setMessage("Bonus approvato!"); await refreshData(); } }} className="inline">
                        <input type="hidden" name="adminPassword" value={password} />
                        <input type="hidden" name="requestId" value={req.id} />
                        <button type="submit" disabled={loading} className="px-3 py-1.5 bg-green-500 text-white text-sm rounded-full hover:bg-green-600 disabled:opacity-50">Approva (+5 pt)</button>
                      </form>
                      <form action={async (fd) => { const r = await rejectSocialBonusRequest(fd); if (r?.error) setError(r.error); else { setMessage("Richiesta rifiutata."); await refreshData(); } }} className="inline">
                        <input type="hidden" name="adminPassword" value={password} />
                        <input type="hidden" name="requestId" value={req.id} />
                        <button type="submit" disabled={loading} className="px-3 py-1.5 bg-red-500 text-white text-sm rounded-full hover:bg-red-600 disabled:opacity-50">Rifiuta</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 text-center text-muted">
                <Share2 size={48} className="mx-auto mb-4 text-primary/30" />
                <p>Nessuna richiesta bonus social in attesa.</p>
              </div>
            )}
          </div>
        )}

        {/* ===== MVP ===== */}
        {activeTab === "mvp" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">MVP del Tour</h2>
              <button type="button" onClick={() => { setShowCreateMvp(true); setEditingMvp(null); }} className="px-4 py-2 bg-primary text-white text-sm rounded-full hover:bg-primary-dark flex items-center gap-2">
                <Plus size={14} /> Aggiungi MVP
              </button>
            </div>

            {data?.mvps?.length ? (
              <div className="space-y-2">
                {data.mvps.map((mvp) => (
                  <div key={mvp.id} className="p-4 bg-surface rounded-xl border border-border flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      {mvp.photo_url ? (
                        <img src={mvp.photo_url} alt="" className="w-12 h-12 rounded-lg object-cover border border-border" />
                      ) : (
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center"><Award size={20} className="text-primary/50" /></div>
                      )}
                      <div>
                        <span className="font-medium">{mvp.nome} {mvp.cognome}</span>
                        <span className="text-muted ml-2">— {(mvp.tappe as { nome: string } | null)?.nome ?? mvp.tappa_id}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingMvp(mvp); setShowCreateMvp(false); }} className="px-3 py-1.5 bg-surface border border-border text-sm rounded-full hover:border-primary">Modifica</button>
                      <form action={async (fd) => { const r = await deleteMvp(fd); if (r?.error) setError(r.error); else { setMessage("MVP eliminato."); await refreshData(); } }} className="inline">
                        <input type="hidden" name="adminPassword" value={password} />
                        <input type="hidden" name="id" value={mvp.id} />
                        <button type="submit" className="px-3 py-1.5 bg-red-500/20 text-red-400 text-sm rounded-full hover:bg-red-500/30">Elimina</button>
                      </form>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-12 bg-surface rounded-2xl border border-dashed border-border text-center text-muted">
                <Award size={48} className="mx-auto mb-4 text-primary/30" />
                <p>Nessun MVP. Aggiungi il primo.</p>
              </div>
            )}

            {/* Create MVP form */}
            {showCreateMvp && (
              <div className="p-8 bg-surface rounded-2xl border border-border">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4">Nuovo MVP</h3>
                <form action={async (fd) => { const r = await createMvp(fd); if (r?.error) setError(r.error); else { setMessage("MVP aggiunto!"); setShowCreateMvp(false); await refreshData(); } }} className="space-y-4">
                  <input type="hidden" name="adminPassword" value={password} />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-muted mb-2">Tappa *</label><select name="tappa_id" required className={inputClass}>{data?.tappe.map((t) => <option key={t.id} value={t.id}>{t.nome}</option>)}</select></div>
                    <div><label className="block text-sm text-muted mb-2">Nome *</label><input name="nome" required className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Cognome *</label><input name="cognome" required className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">URL foto</label><input name="photo_url" type="url" className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Ordine</label><input name="ordine" type="number" defaultValue={0} className={inputClass} /></div>
                  </div>
                  <div><label className="block text-sm text-muted mb-2">Bio</label><textarea name="bio" rows={3} className={inputClass} /></div>
                  <div><label className="block text-sm text-muted mb-2">Carriera</label><textarea name="carriera" rows={3} className={inputClass} /></div>
                  <div><label className="block text-sm text-muted mb-2">Stats (JSON, es. {`{"punti_media": 12}`})</label><textarea name="stats" rows={2} className={inputClass} placeholder='{"punti_media": 12}' /></div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50">Salva</button>
                    <button type="button" onClick={() => setShowCreateMvp(false)} className="px-4 py-2 bg-surface border border-border rounded-full">Annulla</button>
                  </div>
                </form>
              </div>
            )}

            {/* Edit MVP form */}
            {editingMvp && !showCreateMvp && (
              <div className="p-8 bg-surface rounded-2xl border border-border">
                <h3 className="font-[family-name:var(--font-bebas)] text-xl tracking-wider mb-4">Modifica MVP</h3>
                <form action={async (fd) => { const r = await updateMvp(fd); if (r?.error) setError(r.error); else { setMessage("MVP aggiornato!"); setEditingMvp(null); await refreshData(); } }} className="space-y-4">
                  <input type="hidden" name="adminPassword" value={password} />
                  <input type="hidden" name="id" value={editingMvp.id} />
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="block text-sm text-muted mb-2">Nome *</label><input name="nome" defaultValue={editingMvp.nome} required className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Cognome *</label><input name="cognome" defaultValue={editingMvp.cognome} required className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">URL foto</label><input name="photo_url" type="url" defaultValue={editingMvp.photo_url ?? ""} className={inputClass} /></div>
                    <div><label className="block text-sm text-muted mb-2">Ordine</label><input name="ordine" type="number" defaultValue={editingMvp.ordine} className={inputClass} /></div>
                  </div>
                  <div><label className="block text-sm text-muted mb-2">Bio</label><textarea name="bio" rows={3} defaultValue={editingMvp.bio ?? ""} className={inputClass} /></div>
                  <div><label className="block text-sm text-muted mb-2">Carriera</label><textarea name="carriera" rows={3} defaultValue={editingMvp.carriera ?? ""} className={inputClass} /></div>
                  <div><label className="block text-sm text-muted mb-2">Stats (JSON)</label><textarea name="stats" rows={2} defaultValue={JSON.stringify(editingMvp.stats || {}, null, 2)} className={inputClass} /></div>
                  <div className="flex gap-3">
                    <button type="submit" disabled={loading} className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-dark disabled:opacity-50">Salva</button>
                    <button type="button" onClick={() => setEditingMvp(null)} className="px-4 py-2 bg-surface border border-border rounded-full">Annulla</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
