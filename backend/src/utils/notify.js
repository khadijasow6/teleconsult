const db = require("../config/db");
const { sendMail } = require("./mailer");

/**
 * Crée une notification in-app pour un utilisateur, et envoie
 * en parallèle un e-mail si une adresse est fournie.
 *
 * @param {Object} params
 * @param {number} params.userId - Utilisateur destinataire (table users)
 * @param {string} params.type - Type de notification (voir ENUM notifications.type)
 * @param {string} params.title - Titre court affiché dans la cloche
 * @param {string} params.message - Message détaillé
 * @param {number} [params.appointmentId] - Rendez-vous lié, si applicable
 * @param {string} [params.email] - Adresse e-mail du destinataire
 * @param {string} [params.emailSubject] - Sujet de l'e-mail (par défaut = title)
 * @param {string} [params.emailHtml] - Corps HTML de l'e-mail (par défaut = message)
 */
const notifyUser = async ({
  userId,
  type,
  title,
  message,
  appointmentId = null,
  email = null,
  emailSubject = null,
  emailHtml = null,
}) => {
  try {
    await db.query(
      `
        INSERT INTO notifications (
          user_id,
          type,
          title,
          message,
          related_appointment_id
        )
        VALUES (?, ?, ?, ?, ?)
      `,
      [userId, type, title, message, appointmentId]
    );
  } catch (error) {
    console.error(
      "[notify] Impossible de créer la notification in-app :",
      error.message
    );
  }

  if (email) {
    const html =
      emailHtml ||
      `
        <div style="font-family: Arial, sans-serif; color: #173b5c;">
          <h2 style="color: #176baf;">${title}</h2>
          <p>${message}</p>
          <p style="margin-top: 24px; font-size: 12px; color: #7890a4;">
            SamaSanté — Prise de rendez-vous médicaux en ligne
          </p>
        </div>
      `;

    // Envoi asynchrone, sans bloquer ni faire échouer l'action principale
    sendMail({
      to: email,
      subject: emailSubject || title,
      html,
    }).catch(() => {});
  }
};

module.exports = { notifyUser };