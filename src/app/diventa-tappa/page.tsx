"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, MapPin, Calendar, Clock, User, Mail, Phone, Instagram, Loader2, CheckCircle } from "lucide-react";
import { submitTappaApplication } from "@/app/actions/tappa-application";
import AckModal from "@/components/AckModal";

export default function DiventaTappaPage() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitTappaApplication(formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      (e.target as HTMLFormElement).reset();
    }
  }

  const inputClass = "w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground placeholder:text-muted/40 focus:outline-none focus:border-primary transition-colors text-sm";

  return (
    <div className="pt-24 pb-20">
      <div className="max-w-3xl mx-auto px-4">
        {/* Back link */}
        <Link
          href="/contatti"
          className="inline-flex items-center gap-2 text-muted hover:text-primary transition-colors mb-8"
        >
          <ArrowLeft size={16} />
          Torna ai contatti
        </Link>

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-[family-name:var(--font-bebas)] text-5xl sm:text-6xl tracking-wider mb-4">
            DIVENTA UNA TAPPA
          </h1>
          <p className="text-lg text-muted">
            Organizzi un torneo 3x3 in Romagna? Compila il modulo per candidare il tuo
            torneo come tappa ufficiale del Romagna Summer Hoops Tour.
          </p>
        </div>

        {/* Benefits */}
        <div className="p-6 bg-surface rounded-2xl border border-primary/20 mb-8">
          <div className="space-y-3">
            <div className="flex items-start gap-3 text-sm text-muted">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                1
              </span>
              <p>Mantieni il tuo nome, format e gestione operativa</p>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                2
              </span>
              <p>Le tue squadre entrano nella classifica generale</p>
            </div>
            <div className="flex items-start gap-3 text-sm text-muted">
              <span className="w-6 h-6 bg-primary/20 text-primary rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <p>Più visibilità attraverso la rete del Tour</p>
            </div>
          </div>
        </div>

        <AckModal
          open={success}
          onClose={() => setSuccess(false)}
          variant="success"
          title="Domanda Inviata!"
          message="La tua candidatura è stata inviata con successo. Ti contatteremo via email entro pochi giorni lavorativi."
        />
        <AckModal
          open={!!error}
          onClose={() => setError("")}
          variant="error"
          title="Errore"
          message={error}
        />

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">

          {/* Organizer Section */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <User size={20} className="text-primary" />
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                INFORMAZIONI ORGANIZZATORE
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">Nome Organizzatore *</label>
                <input
                  name="nomeOrganizzatore"
                  type="text"
                  required
                  placeholder="Es: Ghetto Ponente"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Email *</label>
                  <input
                    name="emailOrganizzatore"
                    type="email"
                    required
                    placeholder="organizzatore@email.com"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Telefono</label>
                  <input
                    name="telefonoOrganizzatore"
                    type="tel"
                    placeholder="+39 333 1234567"
                    className={inputClass}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Tournament Section */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <MapPin size={20} className="text-accent" />
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                INFORMAZIONI TORNEO
              </h2>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Nome Torneo *</label>
                  <input
                    name="nomeTorneo"
                    type="text"
                    required
                    placeholder="Es: KOTG"
                    className={inputClass}
                    onChange={(e) => {
                      const nomeCompletoInput = e.currentTarget.form?.querySelector('[name="nomeCompletoTorneo"]') as HTMLInputElement;
                      if (nomeCompletoInput && e.target.value) {
                        nomeCompletoInput.value = `${e.target.value} - Tappa Ufficiale RSHT`;
                      }
                    }}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Nome Completo</label>
                  <input
                    name="nomeCompletoTorneo"
                    type="text"
                    placeholder="Es: Kings of the Ghetto - Tappa Ufficiale RSHT"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Data *</label>
                  <input
                    name="dataProposta"
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Orario</label>
                  <input
                    name="orarioProposto"
                    type="text"
                    placeholder="16:00"
                    defaultValue="16:00"
                    className={inputClass}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-muted mb-2">Luogo *</label>
                  <input
                    name="luogo"
                    type="text"
                    required
                    placeholder="Es: Cesenatico"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="block text-sm text-muted mb-2">Provincia</label>
                  <input
                    name="provincia"
                    type="text"
                    placeholder="Es: Forli-Cesena"
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Indirizzo</label>
                <input
                  name="indirizzo"
                  type="text"
                  placeholder="Es: Cesenatico (FC)"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Instagram Torneo</label>
                <input
                  name="instagramTorneo"
                  type="text"
                  placeholder="@nometorneo"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Logo del torneo (URL)</label>
                <input
                  name="logoUrl"
                  type="url"
                  placeholder="https://..."
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm text-muted mb-2">Oppure carica immagine</label>
                <input
                  name="logo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  className="w-full text-sm text-muted file:mr-3 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-primary file:text-white file:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Descrizione</label>
                <textarea
                  name="descrizione"
                  rows={4}
                  placeholder="Descrivi il tuo torneo, la sua storia, il format..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="p-8 bg-surface rounded-2xl border border-border">
            <div className="flex items-center gap-2 mb-6">
              <Calendar size={20} className="text-gold" />
              <h2 className="font-[family-name:var(--font-bebas)] text-2xl tracking-wider">
                INFORMAZIONI AGGIUNTIVE
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-muted mb-2">Numero Squadre Previste</label>
                <input
                  name="numeroSquadrePreviste"
                  type="number"
                  min="0"
                  placeholder="Es: 16"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block text-sm text-muted mb-2">Note Aggiuntive</label>
                <textarea
                  name="noteAggiuntive"
                  rows={3}
                  placeholder="Altre informazioni che vuoi condividere..."
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-4 bg-primary text-white font-bold rounded-full hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Invio in corso...
              </>
            ) : success ? (
              <>
                <CheckCircle size={20} />
                Inviato!
              </>
            ) : (
              <>
                <Mail size={20} />
                Invia Domanda
              </>
            )}
          </button>

          <p className="text-xs text-muted/60 text-center">
            Riceverai una risposta via email entro pochi giorni lavorativi.
          </p>
        </form>
      </div>
    </div>
  );
}
