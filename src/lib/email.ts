import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const ADMIN_EMAIL = "matiazoffoli@gmail.com"; // Verified email for Resend free tier
const FROM_EMAIL = "Romagna Summer Hoops Tour <onboarding@resend.dev>"; // Using Resend's default domain for now

export async function sendEmail({
  to,
  subject,
  html,
  text,
}: {
  to: string;
  subject: string;
  html: string;
  text?: string;
}) {
  try {
    const { data, error } = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text fallback
    });

    if (error) {
      console.error("Resend error:", error);
      return { success: false, error };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Email send error:", error);
    return { success: false, error };
  }
}

export async function notifyAdminNewApplication(application: {
  nome_organizzatore: string;
  email_organizzatore: string;
  telefono_organizzatore: string | null;
  nome_torneo: string;
  nome_completo_torneo: string | null;
  data_proposta: string;
  orario_proposto: string;
  luogo: string;
  provincia: string | null;
  descrizione: string | null;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6b35;">Nuova Candidatura Tappa</h2>
      <p>Hai ricevuto una nuova candidatura per diventare una tappa del Romagna Summer Hoops Tour.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="margin-top: 0;">${application.nome_torneo}</h3>
        ${application.nome_completo_torneo ? `<p><strong>Nome completo:</strong> ${application.nome_completo_torneo}</p>` : ""}
        
        <p><strong>Organizzatore:</strong> ${application.nome_organizzatore}</p>
        <p><strong>Email:</strong> ${application.email_organizzatore}</p>
        ${application.telefono_organizzatore ? `<p><strong>Telefono:</strong> ${application.telefono_organizzatore}</p>` : ""}
        
        <p><strong>Data proposta:</strong> ${application.data_proposta} · ${application.orario_proposto}</p>
        <p><strong>Luogo:</strong> ${application.luogo}${application.provincia ? ` (${application.provincia})` : ""}</p>
        
        ${application.descrizione ? `<p><strong>Descrizione:</strong><br>${application.descrizione.replace(/\n/g, "<br>")}</p>` : ""}
      </div>
      
      <p><a href="https://romagna-summer-hoops-tour.vercel.app/admin" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Vai all'Admin Panel</a></p>
    </div>
  `;

  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nuova candidatura tappa: ${application.nome_torneo}`,
    html,
  });
}

export async function notifyOrganizerApproved(application: {
  email_organizzatore: string;
  nome_organizzatore: string;
  nome_torneo: string;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #ff6b35;">La tua candidatura è stata approvata!</h2>
      <p>Ciao ${application.nome_organizzatore},</p>
      
      <p>Siamo felici di informarti che la tua candidatura per <strong>${application.nome_torneo}</strong> è stata approvata!</p>
      
      <p>Il tuo torneo è ora una tappa ufficiale del <strong>Romagna Summer Hoops Tour</strong>.</p>
      
      <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Prossimi passi:</strong></p>
        <ul>
          <li>La tua tappa è visibile sul sito web</li>
          <li>Le squadre possono iscriversi contattandoti direttamente</li>
          <li>I risultati del tuo torneo entreranno nella classifica generale</li>
        </ul>
      </div>
      
      <p>Se hai domande o bisogno di supporto, non esitare a contattarci.</p>
      
      <p>Buona fortuna per il tuo torneo!</p>
      <p><strong>Il Team del Romagna Summer Hoops Tour</strong></p>
    </div>
  `;

  return sendEmail({
    to: application.email_organizzatore,
    subject: `La tua candidatura è stata approvata - ${application.nome_torneo}`,
    html,
  });
}

export async function notifyOrganizerRejected(application: {
  email_organizzatore: string;
  nome_organizzatore: string;
  nome_torneo: string;
  reason?: string | null;
}) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Riguardo la tua candidatura</h2>
      <p>Ciao ${application.nome_organizzatore},</p>
      
      <p>Grazie per la tua candidatura per <strong>${application.nome_torneo}</strong> al Romagna Summer Hoops Tour.</p>
      
      <p>Dopo un'attenta valutazione, purtroppo non possiamo accettare la tua candidatura in questo momento.</p>
      
      ${application.reason ? `<div style="background: #f5f5f5; padding: 15px; border-radius: 8px; margin: 20px 0;"><p><strong>Note:</strong> ${application.reason}</p></div>` : ""}
      
      <p>Ti ringraziamo comunque per il tuo interesse e ti auguriamo buona fortuna con il tuo torneo.</p>
      
      <p>Se hai domande, puoi sempre contattarci.</p>
      
      <p>Cordiali saluti,<br><strong>Il Team del Romagna Summer Hoops Tour</strong></p>
    </div>
  `;

  return sendEmail({
    to: application.email_organizzatore,
    subject: `Riguardo la tua candidatura - ${application.nome_torneo}`,
    html,
  });
}
