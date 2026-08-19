const db = require("../config/db");
const { notifyUser } = require("../utils/notify");

const getUserId = (req) =>
  req.user?.id || req.user?.userId || req.user?.user_id;

const generateReference = () => {
  const timestamp = Date.now().toString().slice(-8);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `PAY-${timestamp}${random}`;
};

const generateConfirmationCode = () =>
  String(Math.floor(100000 + Math.random() * 900000));

// Initie un paiement : crée l'enregistrement et "envoie" un code de confirmation
const initiatePayment = async (req, res) => {
  try {
    const patientId = getUserId(req);

    if (req.user?.role !== "PATIENT") {
      return res.status(403).json({
        message: "Accès réservé aux patients.",
      });
    }

    const { appointment_id, method, phone_number } = req.body;

    if (!appointment_id || !method || !phone_number) {
      return res.status(400).json({
        message:
          "Le rendez-vous, le mode de paiement et le numéro de téléphone sont obligatoires.",
      });
    }

    if (!["WAVE", "ORANGE_MONEY"].includes(method)) {
      return res.status(400).json({
        message: "Mode de paiement invalide.",
      });
    }

    const [appointments] = await db.query(
      `
        SELECT
          ap.id,
          ap.status,
          dp.consultation_price
        FROM appointments ap
        INNER JOIN availabilities a
          ON a.id = ap.availability_id
        INNER JOIN doctor_profiles dp
          ON dp.id = a.doctor_profile_id
        WHERE ap.id = ?
          AND ap.patient_id = ?
        LIMIT 1
      `,
      [appointment_id, patientId]
    );

    if (appointments.length === 0) {
      return res.status(404).json({
        message: "Rendez-vous introuvable.",
      });
    }

    if (appointments[0].status !== "EN_ATTENTE_PAIEMENT") {
      return res.status(400).json({
        message: "Ce rendez-vous n'est pas en attente de paiement.",
      });
    }

    const reference = generateReference();
    const confirmationCode = generateConfirmationCode();

    const [result] = await db.query(
      `
        INSERT INTO payments (
          appointment_id,
          method,
          phone_number,
          amount,
          transaction_reference,
          confirmation_code
        )
        VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        appointment_id,
        method,
        phone_number.trim(),
        appointments[0].consultation_price,
        reference,
        confirmationCode,
      ]
    );

    // NOTE : en production, ce code serait envoyé par SMS via l'API
    // Wave ou Orange Money. Ici, il est simulé et renvoyé directement
    // pour permettre la démonstration sans compte marchand réel.
    return res.status(201).json({
      message: "Paiement initié. Un code de confirmation a été envoyé.",
      payment_id: result.insertId,
      transaction_reference: reference,
      amount: appointments[0].consultation_price,
      simulated_confirmation_code: confirmationCode,
    });
  } catch (error) {
    console.error("Erreur initiation paiement :", error);

    return res.status(500).json({
      message: "Impossible d'initier le paiement.",
    });
  }
};

// Confirme le paiement à partir du code reçu (simulation SMS)
const confirmPayment = async (req, res) => {
  try {
    const patientId = getUserId(req);

    if (req.user?.role !== "PATIENT") {
      return res.status(403).json({
        message: "Accès réservé aux patients.",
      });
    }

    const { payment_id, confirmation_code } = req.body;

    if (!payment_id || !confirmation_code) {
      return res.status(400).json({
        message: "Le paiement et le code de confirmation sont obligatoires.",
      });
    }

    const [payments] = await db.query(
      `
        SELECT
          p.id,
          p.status,
          p.confirmation_code,
          p.appointment_id,
          ap.patient_id,
          a.start_time,
          doctor.id AS doctor_user_id,
          doctor.email AS doctor_email,
          TRIM(doctor.first_name) AS doctor_first_name,
          TRIM(doctor.last_name) AS doctor_last_name
        FROM payments p
        INNER JOIN appointments ap
          ON ap.id = p.appointment_id
        INNER JOIN availabilities a
          ON a.id = ap.availability_id
        INNER JOIN doctor_profiles dp
          ON dp.id = a.doctor_profile_id
        INNER JOIN users doctor
          ON doctor.id = dp.user_id
        WHERE p.id = ?
        LIMIT 1
      `,
      [payment_id]
    );

    if (payments.length === 0 || payments[0].patient_id !== patientId) {
      return res.status(404).json({
        message: "Paiement introuvable.",
      });
    }

    const payment = payments[0];

    if (payment.status !== "EN_ATTENTE") {
      return res.status(400).json({
        message: "Ce paiement a déjà été traité.",
      });
    }

    if (payment.confirmation_code !== confirmation_code.trim()) {
      await db.query(
        `UPDATE payments SET status = 'ECHEC' WHERE id = ?`,
        [payment_id]
      );

      return res.status(400).json({
        message: "Code de confirmation incorrect.",
      });
    }

    await db.query(
      `
        UPDATE payments
        SET status = 'PAYE', paid_at = NOW()
        WHERE id = ?
      `,
      [payment_id]
    );

    await db.query(
      `
        UPDATE appointments
        SET status = 'EN_ATTENTE'
        WHERE id = ?
      `,
      [payment.appointment_id]
    );

    const [patientRows] = await db.query(
      `SELECT TRIM(first_name) AS first_name, TRIM(last_name) AS last_name FROM users WHERE id = ? LIMIT 1`,
      [patientId]
    );
    const patientName = patientRows[0]
      ? `${patientRows[0].first_name} ${patientRows[0].last_name}`
      : "Un patient";

    const appointmentDate = new Date(payment.start_time).toLocaleString(
      "fr-FR",
      { dateStyle: "long", timeStyle: "short" }
    );

    await notifyUser({
      userId: payment.doctor_user_id,
      type: "RENDEZ_VOUS_CREE",
      title: "Nouvelle demande de rendez-vous",
      message: `${patientName} a demandé un rendez-vous le ${appointmentDate} (paiement confirmé).`,
      appointmentId: payment.appointment_id,
      email: payment.doctor_email,
      emailSubject: "SamaSanté — Nouvelle demande de rendez-vous",
    });

    return res.status(200).json({
      message: "Paiement confirmé avec succès.",
    });
  } catch (error) {
    console.error("Erreur confirmation paiement :", error);

    return res.status(500).json({
      message: "Impossible de confirmer le paiement.",
    });
  }
};

const getPaymentForAppointment = async (req, res) => {
  try {
    const patientId = getUserId(req);
    const appointmentId = req.params.appointmentId;

    const [payments] = await db.query(
      `
        SELECT
          p.id,
          p.method,
          p.amount,
          p.status,
          p.transaction_reference,
          p.created_at,
          p.paid_at
        FROM payments p
        INNER JOIN appointments ap
          ON ap.id = p.appointment_id
        WHERE p.appointment_id = ?
          AND ap.patient_id = ?
        ORDER BY p.created_at DESC
        LIMIT 1
      `,
      [appointmentId, patientId]
    );

    return res.status(200).json({
      payment: payments[0] || null,
    });
  } catch (error) {
    console.error("Erreur récupération paiement :", error);

    return res.status(500).json({
      message: "Impossible de récupérer le paiement.",
    });
  }
};

module.exports = {
  initiatePayment,
  confirmPayment,
  getPaymentForAppointment,
};