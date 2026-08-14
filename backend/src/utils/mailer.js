const nodemailer = require("nodemailer");

let transporter = null;
let mailerReady = false;

const initTransporter = () => {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;

  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASS) {
    console.warn(
      "[mailer] Configuration SMTP absente : les e-mails ne seront pas envoyés (SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS requis dans .env)."
    );
    return null;
  }

  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: Number(SMTP_PORT),
    secure: Number(SMTP_PORT) === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });

  mailerReady = true;

  return transporter;
};

initTransporter();

/**
 * Envoie un e-mail. Ne lance jamais d'exception : en cas d'échec ou
 * d'absence de configuration SMTP, l'erreur est simplement journalisée
 * pour ne jamais bloquer le flux principal (création de rendez-vous, etc).
 */
const sendMail = async ({ to, subject, html }) => {
  if (!mailerReady || !transporter) {
    return { sent: false, reason: "SMTP non configuré" };
  }

  if (!to) {
    return { sent: false, reason: "Destinataire manquant" };
  }

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || `"SamaSanté" <no-reply@samasante.sn>`,
      to,
      subject,
      html,
    });

    return { sent: true };
  } catch (error) {
    console.error("[mailer] Échec de l'envoi de l'e-mail :", error.message);

    return { sent: false, reason: error.message };
  }
};

module.exports = { sendMail };