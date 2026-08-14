const db = require("../config/db");
const { notifyUser } = require("../utils/notify");

const getAdminDashboard = async (req, res) => {
try {
const [users] = await db.query(`       SELECT
        id,
        first_name,
        last_name,
        email,
        phone,
        role,
        created_at
      FROM users
      ORDER BY created_at DESC
    `);


const [doctors] = await db.query(`
  SELECT
    dp.id AS doctor_profile_id,
    u.id AS user_id,
    u.first_name,
    u.last_name,
    u.email,
    u.phone,
    s.name AS specialty_name,
    dp.license_number,
    dp.years_of_experience,
    dp.consultation_price,
    dp.validation_status,
    dp.created_at
  FROM doctor_profiles dp
  INNER JOIN users u ON u.id = dp.user_id
  INNER JOIN specialties s ON s.id = dp.specialty_id
  ORDER BY dp.created_at DESC
`);

const [appointments] = await db.query(`
  SELECT
    a.id AS appointment_id,
    a.reason,
    a.status,
    a.meeting_url,
    av.start_time,
    av.end_time,
    patient.first_name AS patient_first_name,
    patient.last_name AS patient_last_name,
    doctor.first_name AS doctor_first_name,
    doctor.last_name AS doctor_last_name,
    s.name AS specialty_name
  FROM appointments a
  INNER JOIN availabilities av
    ON av.id = a.availability_id
  INNER JOIN doctor_profiles dp
    ON dp.id = av.doctor_profile_id
  INNER JOIN users doctor
    ON doctor.id = dp.user_id
  INNER JOIN users patient
    ON patient.id = a.patient_id
  INNER JOIN specialties s
    ON s.id = dp.specialty_id
  ORDER BY av.start_time DESC
`);

const statistics = {
  total_users: users.length,

  total_patients: users.filter(
    (user) => user.role === "PATIENT"
  ).length,

  total_doctors: doctors.length,

  pending_doctors: doctors.filter(
    (doctor) =>
      doctor.validation_status === "EN_ATTENTE"
  ).length,

  total_appointments: appointments.length,

  pending_appointments: appointments.filter(
    (appointment) =>
      appointment.status === "EN_ATTENTE"
  ).length,
};

return res.status(200).json({
  statistics,
  users,
  doctors,
  appointments,
});


} catch (error) {
console.error(
"Erreur dashboard administrateur :",
error
);


return res.status(500).json({
  message:
    "Impossible de charger le dashboard administrateur.",
});


}
};

const updateDoctorValidationStatus = async (
req,
res
) => {
try {
const doctorProfileId = req.params.id;
const { status } = req.body;


const allowedStatuses = [
  "EN_ATTENTE",
  "VALIDE",
  "REFUSE",
];

if (!allowedStatuses.includes(status)) {
  return res.status(400).json({
    message:
      "Le statut du médecin est invalide.",
  });
}

const [doctorRows] = await db.query(
  `
    SELECT
      u.id AS user_id,
      u.email,
      TRIM(u.first_name) AS first_name,
      TRIM(u.last_name) AS last_name
    FROM doctor_profiles dp
    INNER JOIN users u ON u.id = dp.user_id
    WHERE dp.id = ?
    LIMIT 1
  `,
  [doctorProfileId]
);

if (doctorRows.length === 0) {
  return res.status(404).json({
    message: "Médecin introuvable.",
  });
}

const [result] = await db.query(
  `
    UPDATE doctor_profiles
    SET validation_status = ?
    WHERE id = ?
  `,
  [status, doctorProfileId]
);

if (result.affectedRows === 0) {
  return res.status(404).json({
    message: "Médecin introuvable.",
  });
}

if (status === "VALIDE" || status === "REFUSE") {
  const doctor = doctorRows[0];

  await notifyUser({
    userId: doctor.user_id,
    type: status === "VALIDE" ? "MEDECIN_VALIDE" : "MEDECIN_REFUSE",
    title:
      status === "VALIDE"
        ? "Votre compte a été validé"
        : "Votre demande a été refusée",
    message:
      status === "VALIDE"
        ? "Votre compte médecin a été validé par l'administrateur. Vous pouvez désormais vous connecter à votre tableau de bord."
        : "Votre demande d'inscription en tant que médecin a été refusée par l'administrateur.",
    email: doctor.email,
    emailSubject:
      status === "VALIDE"
        ? "SamaSanté — Votre compte médecin a été validé"
        : "SamaSanté — Votre demande a été refusée",
  });
}

return res.status(200).json({
  message:
    "Le statut du médecin a été mis à jour.",
});


} catch (error) {
console.error(
"Erreur validation médecin :",
error
);


return res.status(500).json({
  message:
    "Impossible de modifier le statut du médecin.",
});


}
};

module.exports = {
getAdminDashboard,
updateDoctorValidationStatus,
};