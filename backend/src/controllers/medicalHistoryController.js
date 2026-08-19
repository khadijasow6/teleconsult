const db = require("../config/db");

const getUserId = (req) =>
  req.user?.id || req.user?.userId || req.user?.user_id;

// Historique médical complet du patient connecté :
// toutes les consultations terminées, avec diagnostic et ordonnance liée
const getPatientMedicalHistory = async (req, res) => {
  try {
    const patientId = getUserId(req);

    if (req.user?.role !== "PATIENT") {
      return res.status(403).json({
        message: "Accès réservé aux patients.",
      });
    }

    const [rows] = await db.query(
      `
        SELECT
          ap.id AS appointment_id,
          ap.reason,
          ap.status,
          a.start_time,
          TRIM(doctor.first_name) AS doctor_first_name,
          TRIM(doctor.last_name) AS doctor_last_name,
          s.name AS specialty_name,
          c.id AS consultation_id,
          c.symptoms,
          c.diagnosis,
          c.doctor_notes,
          p.id AS prescription_id,
          p.instructions AS prescription_instructions,
          p.issued_at
        FROM appointments ap
        INNER JOIN availabilities a
          ON a.id = ap.availability_id
        INNER JOIN doctor_profiles dp
          ON dp.id = a.doctor_profile_id
        INNER JOIN users doctor
          ON doctor.id = dp.user_id
        INNER JOIN specialties s
          ON s.id = dp.specialty_id
        LEFT JOIN consultations c
          ON c.appointment_id = ap.id
        LEFT JOIN prescriptions p
          ON p.consultation_id = c.id
        WHERE ap.patient_id = ?
          AND ap.status IN ('CONFIRME', 'TERMINE')
        ORDER BY a.start_time DESC
      `,
      [patientId]
    );

    const [medicationRows] = await db.query(
      `
        SELECT
          pi.prescription_id,
          pi.medication_name,
          pi.dosage,
          pi.frequency,
          pi.duration
        FROM prescription_items pi
        INNER JOIN prescriptions p
          ON p.id = pi.prescription_id
        INNER JOIN consultations c
          ON c.id = p.consultation_id
        INNER JOIN appointments ap
          ON ap.id = c.appointment_id
        WHERE ap.patient_id = ?
      `,
      [patientId]
    );

    const medicationsByPrescription = {};
    medicationRows.forEach((medication) => {
      if (!medicationsByPrescription[medication.prescription_id]) {
        medicationsByPrescription[medication.prescription_id] = [];
      }
      medicationsByPrescription[medication.prescription_id].push(medication);
    });

    const history = rows.map((row) => ({
      appointment_id: row.appointment_id,
      start_time: row.start_time,
      status: row.status,
      reason: row.reason,
      doctor_first_name: row.doctor_first_name,
      doctor_last_name: row.doctor_last_name,
      specialty_name: row.specialty_name,
      symptoms: row.symptoms,
      diagnosis: row.diagnosis,
      doctor_notes: row.doctor_notes,
      prescription: row.prescription_id
        ? {
            prescription_id: row.prescription_id,
            instructions: row.prescription_instructions,
            issued_at: row.issued_at,
            medications:
              medicationsByPrescription[row.prescription_id] || [],
          }
        : null,
    }));

    return res.status(200).json({
      history,
    });
  } catch (error) {
    console.error("Erreur historique médical patient :", error);

    return res.status(500).json({
      message: "Impossible de récupérer l'historique médical.",
    });
  }
};

// Historique médical d'un patient précis, consultable par un médecin
// qui a déjà eu au moins un rendez-vous confirmé avec ce patient
const getPatientMedicalHistoryForDoctor = async (req, res) => {
  try {
    const doctorUserId = getUserId(req);
    const patientId = req.params.patientId;

    if (req.user?.role !== "MEDECIN") {
      return res.status(403).json({
        message: "Accès réservé aux médecins.",
      });
    }

    const [accessCheck] = await db.query(
      `
        SELECT ap.id
        FROM appointments ap
        INNER JOIN availabilities a
          ON a.id = ap.availability_id
        INNER JOIN doctor_profiles dp
          ON dp.id = a.doctor_profile_id
        WHERE dp.user_id = ?
          AND ap.patient_id = ?
          AND ap.status IN ('CONFIRME', 'TERMINE')
        LIMIT 1
      `,
      [doctorUserId, patientId]
    );

    if (accessCheck.length === 0) {
      return res.status(403).json({
        message:
          "Vous n'avez pas accès à l'historique médical de ce patient.",
      });
    }

    const [rows] = await db.query(
      `
        SELECT
          ap.id AS appointment_id,
          ap.reason,
          ap.status,
          a.start_time,
          TRIM(doctor.first_name) AS doctor_first_name,
          TRIM(doctor.last_name) AS doctor_last_name,
          s.name AS specialty_name,
          c.id AS consultation_id,
          c.symptoms,
          c.diagnosis,
          c.doctor_notes,
          p.id AS prescription_id,
          p.instructions AS prescription_instructions,
          p.issued_at
        FROM appointments ap
        INNER JOIN availabilities a
          ON a.id = ap.availability_id
        INNER JOIN doctor_profiles dp
          ON dp.id = a.doctor_profile_id
        INNER JOIN users doctor
          ON doctor.id = dp.user_id
        INNER JOIN specialties s
          ON s.id = dp.specialty_id
        LEFT JOIN consultations c
          ON c.appointment_id = ap.id
        LEFT JOIN prescriptions p
          ON p.consultation_id = c.id
        WHERE ap.patient_id = ?
          AND ap.status IN ('CONFIRME', 'TERMINE')
        ORDER BY a.start_time DESC
      `,
      [patientId]
    );

    const [medicationRows] = await db.query(
      `
        SELECT
          pi.prescription_id,
          pi.medication_name,
          pi.dosage,
          pi.frequency,
          pi.duration
        FROM prescription_items pi
        INNER JOIN prescriptions p
          ON p.id = pi.prescription_id
        INNER JOIN consultations c
          ON c.id = p.consultation_id
        INNER JOIN appointments ap
          ON ap.id = c.appointment_id
        WHERE ap.patient_id = ?
      `,
      [patientId]
    );

    const medicationsByPrescription = {};
    medicationRows.forEach((medication) => {
      if (!medicationsByPrescription[medication.prescription_id]) {
        medicationsByPrescription[medication.prescription_id] = [];
      }
      medicationsByPrescription[medication.prescription_id].push(medication);
    });

    const history = rows.map((row) => ({
      appointment_id: row.appointment_id,
      start_time: row.start_time,
      status: row.status,
      reason: row.reason,
      doctor_first_name: row.doctor_first_name,
      doctor_last_name: row.doctor_last_name,
      specialty_name: row.specialty_name,
      symptoms: row.symptoms,
      diagnosis: row.diagnosis,
      doctor_notes: row.doctor_notes,
      prescription: row.prescription_id
        ? {
            prescription_id: row.prescription_id,
            instructions: row.prescription_instructions,
            issued_at: row.issued_at,
            medications:
              medicationsByPrescription[row.prescription_id] || [],
          }
        : null,
    }));

    return res.status(200).json({
      history,
    });
  } catch (error) {
    console.error("Erreur historique médical (vue médecin) :", error);

    return res.status(500).json({
      message: "Impossible de récupérer l'historique médical.",
    });
  }
};

module.exports = {
  getPatientMedicalHistory,
  getPatientMedicalHistoryForDoctor,
};