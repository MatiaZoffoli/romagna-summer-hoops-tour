/**
 * Transactional email via Amazon SES.
 * Required env: AWS_REGION, AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY,
 * SES_FROM_EMAIL (verified sender in SES, e.g. noreply@romagnasummerhoopstour.com).
 */
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { getSiteUrl } from "./site-url";

function getSESClient() {
  const region = process.env.AWS_REGION ?? "eu-south-1";
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID;
  const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY must be set in environment variables."
    );
  }
  return new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
}

const ADMIN_EMAIL = "matiazoffoli@gmail.com";
// Must be a verified email or domain in Amazon SES
const FROM_EMAIL =
  process.env.SES_FROM_EMAIL ?? "Romagna Summer Hoops Tour <noreply@romagnasummerhoopstour.com>";

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
  const textBody = text ?? html.replace(/<[^>]*>/g, "");

  try {
    const ses = getSESClient();
    const command = new SendEmailCommand({
      Source: FROM_EMAIL,
      Destination: {
        ToAddresses: [to],
      },
      Message: {
        Subject: {
          Data: subject,
          Charset: "UTF-8",
        },
        Body: {
          Html: {
            Data: html,
            Charset: "UTF-8",
          },
          Text: {
            Data: textBody,
            Charset: "UTF-8",
          },
        },
      },
    });

    const result = await ses.send(command);
    return { success: true, data: result };
  } catch (error) {
    console.error("SES send error:", error);
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
  let formattedDate = application.data_proposta;
  try {
    const date = new Date(application.data_proposta);
    if (!isNaN(date.getTime())) {
      formattedDate = date.toLocaleDateString("it-IT", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    }
  } catch {
    // keep original
  }

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
        
        <p><strong>Data proposta:</strong> ${formattedDate} · ${application.orario_proposto}</p>
        <p><strong>Luogo:</strong> ${application.luogo}${application.provincia ? ` (${application.provincia})` : ""}</p>
        
        ${application.descrizione ? `<p><strong>Descrizione:</strong><br>${application.descrizione.replace(/\n/g, "<br>")}</p>` : ""}
      </div>
      
      <p><a href="${getSiteUrl()}/admin" style="background: #ff6b35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Vai all'Admin Panel</a></p>
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

const EMAIL_STYLES = {
  font: "Arial, Helvetica, sans-serif",
  primary: "#FF6B35",
  primaryDark: "#E55A2B",
  darkBg: "#1A1A2E",
  darkerBg: "#0D0D0D",
  surface: "#2A2A4A",
  text: "#FFFFFF",
  textMuted: "#9CA3AF",
  radius: "12px",
  btnPadding: "14px 28px",
};

/** Notify admin when a new team registers. */
export async function notifyAdminNewTeam(team: {
  nome: string;
  email: string;
  telefono: string | null;
  instagram: string | null;
  motto: string | null;
  giocatoriCount: number;
}) {
  const html = `
    <div style="font-family: ${EMAIL_STYLES.font}; max-width: 600px; margin: 0 auto; background: ${EMAIL_STYLES.darkerBg}; border-radius: ${EMAIL_STYLES.radius}; overflow: hidden;">
      <div style="background: ${EMAIL_STYLES.darkBg}; padding: 24px 28px; border-bottom: 3px solid ${EMAIL_STYLES.primary};">
        <h1 style="margin: 0; color: ${EMAIL_STYLES.primary}; font-size: 24px; letter-spacing: 0.05em;">ROMAGNA SUMMER HOOPS TOUR</h1>
        <p style="margin: 8px 0 0; color: ${EMAIL_STYLES.textMuted}; font-size: 14px;">Nuova squadra registrata</p>
      </div>
      <div style="padding: 28px;">
        <p style="color: ${EMAIL_STYLES.text}; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">Una nuova squadra si è iscritta al Tour.</p>
        <div style="background: ${EMAIL_STYLES.darkBg}; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid ${EMAIL_STYLES.primary};">
          <p style="margin: 0 0 12px; color: ${EMAIL_STYLES.text}; font-size: 18px; font-weight: bold;">${team.nome}</p>
          <p style="margin: 0 0 6px; color: ${EMAIL_STYLES.textMuted}; font-size: 14px;"><strong style="color: ${EMAIL_STYLES.text};">Email:</strong> ${team.email}</p>
          ${team.telefono ? `<p style="margin: 0 0 6px; color: ${EMAIL_STYLES.textMuted}; font-size: 14px;"><strong style="color: ${EMAIL_STYLES.text};">Telefono:</strong> ${team.telefono}</p>` : ""}
          ${team.instagram ? `<p style="margin: 0 0 6px; color: ${EMAIL_STYLES.textMuted}; font-size: 14px;"><strong style="color: ${EMAIL_STYLES.text};">Instagram:</strong> ${team.instagram}</p>` : ""}
          ${team.motto ? `<p style="margin: 12px 0 0; color: ${EMAIL_STYLES.textMuted}; font-size: 13px; font-style: italic;">"${team.motto}"</p>` : ""}
          <p style="margin: 12px 0 0; color: ${EMAIL_STYLES.textMuted}; font-size: 14px;">Giocatori registrati: <strong style="color: ${EMAIL_STYLES.text};">${team.giocatoriCount}</strong></p>
        </div>
        <p style="margin: 24px 0 0;">
          <a href="${getSiteUrl()}/admin" style="display: inline-block; background: ${EMAIL_STYLES.primary}; color: white; padding: ${EMAIL_STYLES.btnPadding}; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 14px;">Vai all'Admin Panel</a>
        </p>
      </div>
    </div>
  `;
  return sendEmail({
    to: ADMIN_EMAIL,
    subject: `Nuova squadra registrata: ${team.nome}`,
    html,
  });
}

/** Welcome email sent to the team after registration. */
export async function sendWelcomeToTeam(team: { nome: string; email: string }) {
  const siteUrl = getSiteUrl();
  const html = `
    <div style="font-family: ${EMAIL_STYLES.font}; max-width: 600px; margin: 0 auto; background: ${EMAIL_STYLES.darkerBg}; border-radius: ${EMAIL_STYLES.radius}; overflow: hidden;">
      <div style="background: ${EMAIL_STYLES.darkBg}; padding: 28px; border-bottom: 3px solid ${EMAIL_STYLES.primary}; text-align: center;">
        <h1 style="margin: 0; color: ${EMAIL_STYLES.primary}; font-size: 26px; letter-spacing: 0.08em;">ROMAGNA SUMMER HOOPS TOUR</h1>
        <p style="margin: 12px 0 0; color: ${EMAIL_STYLES.textMuted}; font-size: 14px;">Benvenuti nel circuito</p>
      </div>
      <div style="padding: 32px;">
        <p style="color: ${EMAIL_STYLES.text}; font-size: 18px; line-height: 1.6; margin: 0 0 16px;">Ciao <strong>${team.nome}</strong>,</p>
        <p style="color: ${EMAIL_STYLES.text}; font-size: 16px; line-height: 1.7; margin: 0 0 24px;">La vostra squadra è ufficialmente iscritta al <strong>Romagna Summer Hoops Tour</strong>. Siete pronti a far parte del circuito estivo di basket 3x3 della Romagna.</p>
        <div style="background: ${EMAIL_STYLES.darkBg}; padding: 20px; border-radius: 8px; margin: 24px 0; border-left: 4px solid ${EMAIL_STYLES.primary};">
          <p style="margin: 0 0 10px; color: ${EMAIL_STYLES.text}; font-size: 15px; font-weight: bold;">Cosa potete fare ora:</p>
          <ul style="margin: 0; padding-left: 20px; color: ${EMAIL_STYLES.textMuted}; font-size: 14px; line-height: 1.8;">
            <li>Accedere alla <strong style="color: ${EMAIL_STYLES.text};">dashboard</strong> e aggiornare il profilo della squadra</li>
            <li>Consultare le <strong style="color: ${EMAIL_STYLES.text};">tappe</strong> e iscrivervi ai tornei contattando gli organizzatori</li>
            <li>Seguire la <strong style="color: ${EMAIL_STYLES.text};">classifica generale</strong> e accumulare punti per The Finals</li>
          </ul>
        </div>
        <p style="margin: 28px 0 24px; text-align: center;">
          <a href="${siteUrl}/dashboard" style="display: inline-block; background: ${EMAIL_STYLES.primary}; color: white; padding: ${EMAIL_STYLES.btnPadding}; text-decoration: none; border-radius: 999px; font-weight: bold; font-size: 15px;">Vai alla Dashboard</a>
        </p>
        <p style="color: ${EMAIL_STYLES.textMuted}; font-size: 13px; line-height: 1.6; margin: 0;">Ci vediamo in campo. Buon Tour!</p>
        <p style="color: ${EMAIL_STYLES.text}; font-size: 14px; margin: 16px 0 0;"><strong>Il Team del Romagna Summer Hoops Tour</strong></p>
      </div>
    </div>
  `;
  return sendEmail({
    to: team.email,
    subject: `Benvenuti nel Tour – ${team.nome}`,
    html,
  });
}
