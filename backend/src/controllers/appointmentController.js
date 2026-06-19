const db = require("../config/db");

const getUserId = (req) =>
req.user?.id || req.user?.userId || req.user?.user_id;

const normalizeDateTime = (value) => {
if (!value) return value;

const normalizedValue = value.replace("T", " ");

return normalizedValue.length === 16
? `${normalizedValue}:00`
: normalizedValue;
};

const getAvailableSlots = async (req, res) => {
try {
const [slots] = await db.query(`       SELECT
        a.id AS availability_id,
        a.doctor_profile_id,
        a.start_time,
        a.end_time,
        TRIM(u.first_name) AS first_name,
        TRIM(u.last_name) AS last_name,
        s.name AS specialty_name,
        dp.years_of_experience,
        dp.consultation_price
      FROM availabilities a
      INNER JOIN doctor_profiles dp
        ON dp.id = a.doctor_profile_id
      INNER JOIN users u
        ON u.id = dp.user_id
      INNER JOIN specialties s
        ON s.id = dp.specialty_id
      LEFT JOIN appointments ap
        ON ap.availability_id = a.id
        AND ap.status IN ('EN_ATTENTE', 'CONFIRME')
      WHERE a.start_time > NOW()
        AND dp.validation_status = 'VALIDE'
        AND ap.id IS NULL
      ORDER BY a.start_time ASC
    `);


return res.status(200).json({
  slots,
});


} catch (error) {
console.error("Erreur récupération créneaux :", error);


return res.status(500).json({
  message: "Impossible de récupérer les créneaux.",
});


}
};

const createAvailability = async (req, res) => {
try {
const userId = getUserId(req);


if (req.user?.role !== "MEDECIN") {
  return res.status(403).json({
    message: "Accès réservé aux médecins.",
  });
}

const { start_time, end_time } = req.body;

if (!start_time || !end_time) {
  return res.status(400).json({
    message: "La date de début et la date de fin sont obligatoires.",
  });
}

if (new Date(end_time) <= new Date(start_time)) {
  return res.status(400).json({
    message: "L’heure de fin doit être après l’heure de début.",
  });
}

const [profiles] = await db.query(
  `
    SELECT id
    FROM doctor_profiles
    WHERE user_id = ?
    LIMIT 1
  `,
  [userId]
);

if (profiles.length === 0) {
  return res.status(404).json({
    message: "Profil médecin introuvable.",
  });
}

const doctorProfileId = profiles[0].id;
const startTime = normalizeDateTime(start_time);
const endTime = normalizeDateTime(end_time);

const [conflicts] = await db.query(
  `
    SELECT id
    FROM availabilities
    WHERE doctor_profile_id = ?
      AND start_time < ?
      AND end_time > ?
    LIMIT 1
  `,
  [doctorProfileId, endTime, startTime]
);

if (conflicts.length > 0) {
  return res.status(409).json({
    message: "Ce créneau chevauche une disponibilité existante.",
  });
}

const [result] = await db.query(
  `
    INSERT INTO availabilities (
      doctor_profile_id,
      start_time,
      end_time
    )
    VALUES (?, ?, ?)
  `,
  [doctorProfileId, startTime, endTime]
);

return res.status(201).json({
  message: "Disponibilité ajoutée avec succès.",
  availability_id: result.insertId,
});


} catch (error) {
console.error("Erreur création disponibilité :", error);


return res.status(500).json({
  message: "Impossible d’ajouter cette disponibilité.",
});


}
};

const getDoctorAvailabilities = async (req, res) => {
try {
const userId = getUserId(req);


if (req.user?.role !== "MEDECIN") {
  return res.status(403).json({
    message: "Accès réservé aux médecins.",
  });
}

const [availabilities] = await db.query(
  `
    SELECT
      a.id AS availability_id,
      a.start_time,
      a.end_time,
      a.status,
      ap.id AS appointment_id,
      ap.status AS appointment_status,
      ap.reason,
      TRIM(patient.first_name) AS patient_first_name,
      TRIM(patient.last_name) AS patient_last_name
    FROM doctor_profiles dp
    INNER JOIN availabilities a
      ON a.doctor_profile_id = dp.id
    LEFT JOIN appointments ap
      ON ap.availability_id = a.id
    LEFT JOIN users patient
      ON patient.id = ap.patient_id
    WHERE dp.user_id = ?
    ORDER BY a.start_time ASC
  `,
  [userId]
);

return res.status(200).json({
  availabilities,
});


} catch (error) {
console.error("Erreur disponibilités médecin :", error);


return res.status(500).json({
  message: "Impossible de récupérer les disponibilités.",
});


}
};

const createAppointment = async (req, res) => {
try {
const patientId = getUserId(req);


if (req.user?.role !== "PATIENT") {
  return res.status(403).json({
    message: "Accès réservé aux patients.",
  });
}

const { availability_id, reason } = req.body;

if (!availability_id) {
  return res.status(400).json({
    message: "Veuillez choisir un créneau.",
  });
}

const [availabilities] = await db.query(
  `
    SELECT
      a.id,
      a.start_time
    FROM availabilities a
    INNER JOIN doctor_profiles dp
      ON dp.id = a.doctor_profile_id
    WHERE a.id = ?
      AND a.start_time > NOW()
      AND dp.validation_status = 'VALIDE'
    LIMIT 1
  `,
  [availability_id]
);

if (availabilities.length === 0) {
  return res.status(404).json({
    message: "Ce créneau est introuvable ou déjà passé.",
  });
}

const [existingAppointments] = await db.query(
  `
    SELECT id
    FROM appointments
    WHERE availability_id = ?
      AND status IN ('EN_ATTENTE', 'CONFIRME')
    LIMIT 1
  `,
  [availability_id]
);

if (existingAppointments.length > 0) {
  return res.status(409).json({
    message: "Ce créneau est déjà réservé.",
  });
}

const [result] = await db.query(
  `
    INSERT INTO appointments (
      patient_id,
      availability_id,
      reason
    )
    VALUES (?, ?, ?)
  `,
  [
    patientId,
    availability_id,
    reason?.trim() || "Consultation médicale",
  ]
);

return res.status(201).json({
  message: "Rendez-vous réservé avec succès.",
  appointment_id: result.insertId,
});


} catch (error) {
console.error("Erreur réservation rendez-vous :", error);


return res.status(500).json({
  message: "Impossible de réserver ce rendez-vous.",
});


}
};

const getPatientAppointments = async (req, res) => {
try {
const patientId = getUserId(req);


if (req.user?.role !== "PATIENT") {
  return res.status(403).json({
    message: "Accès réservé aux patients.",
  });
}

const [appointments] = await db.query(
  `
    SELECT
      ap.id AS appointment_id,
      ap.reason,
      ap.status,
      ap.meeting_room,
      ap.meeting_url,
      a.start_time,
      a.end_time,
      TRIM(doctor.first_name) AS doctor_first_name,
      TRIM(doctor.last_name) AS doctor_last_name,
      s.name AS specialty_name,
      dp.consultation_price
    FROM appointments ap
    INNER JOIN availabilities a
      ON a.id = ap.availability_id
    INNER JOIN doctor_profiles dp
      ON dp.id = a.doctor_profile_id
    INNER JOIN users doctor
      ON doctor.id = dp.user_id
    INNER JOIN specialties s
      ON s.id = dp.specialty_id
    WHERE ap.patient_id = ?
    ORDER BY a.start_time DESC
  `,
  [patientId]
);

return res.status(200).json({
  appointments,
});


} catch (error) {
console.error("Erreur rendez-vous patient :", error);


return res.status(500).json({
  message: "Impossible de récupérer vos rendez-vous.",
});


}
};

const getDoctorAppointments = async (req, res) => {
try {
const userId = getUserId(req);


if (req.user?.role !== "MEDECIN") {
  return res.status(403).json({
    message: "Accès réservé aux médecins.",
  });
}

const [appointments] = await db.query(
  `
    SELECT
      ap.id AS appointment_id,
      ap.reason,
      ap.status,
      ap.meeting_room,
      ap.meeting_url,
      a.start_time,
      a.end_time,
      TRIM(patient.first_name) AS patient_first_name,
      TRIM(patient.last_name) AS patient_last_name,
      patient.email AS patient_email,
      patient.phone AS patient_phone
    FROM appointments ap
    INNER JOIN availabilities a
      ON a.id = ap.availability_id
    INNER JOIN doctor_profiles dp
      ON dp.id = a.doctor_profile_id
    INNER JOIN users patient
      ON patient.id = ap.patient_id
    WHERE dp.user_id = ?
    ORDER BY a.start_time DESC
  `,
  [userId]
);

return res.status(200).json({
  appointments,
});


} catch (error) {
console.error("Erreur rendez-vous médecin :", error);


return res.status(500).json({
  message: "Impossible de récupérer les rendez-vous.",
});


}
};

const updateAppointmentStatus = async (req, res) => {
try {
const userId = getUserId(req);
const appointmentId = req.params.id;
const { status } = req.body;


if (req.user?.role !== "MEDECIN") {
  return res.status(403).json({
    message: "Accès réservé aux médecins.",
  });
}

if (!["CONFIRME", "REFUSE"].includes(status)) {
  return res.status(400).json({
    message: "Le statut doit être CONFIRME ou REFUSE.",
  });
}

const [appointments] = await db.query(
  `
    SELECT ap.id
    FROM appointments ap
    INNER JOIN availabilities a
      ON a.id = ap.availability_id
    INNER JOIN doctor_profiles dp
      ON dp.id = a.doctor_profile_id
    WHERE ap.id = ?
      AND dp.user_id = ?
    LIMIT 1
  `,
  [appointmentId, userId]
);

if (appointments.length === 0) {
  return res.status(404).json({
    message: "Rendez-vous introuvable.",
  });
}

if (status === "CONFIRME") {
  const meetingRoom = `samasante-${appointmentId}-${Date.now()}`;
  const meetingUrl = `https://meet.jit.si/${meetingRoom}`;

  await db.query(
    `
      UPDATE appointments
      SET
        status = 'CONFIRME',
        meeting_room = ?,
        meeting_url = ?
      WHERE id = ?
    `,
    [meetingRoom, meetingUrl, appointmentId]
  );
} else {
  await db.query(
    `
      UPDATE appointments
      SET
        status = 'REFUSE',
        meeting_room = NULL,
        meeting_url = NULL
      WHERE id = ?
    `,
    [appointmentId]
  );
}

return res.status(200).json({
  message:
    status === "CONFIRME"
      ? "Rendez-vous confirmé avec succès."
      : "Rendez-vous refusé.",
});


} catch (error) {
console.error("Erreur modification rendez-vous :", error);


return res.status(500).json({
  message: "Impossible de modifier ce rendez-vous.",
});


}
};

const getAdminAppointments = async (req, res) => {
try {
if (req.user?.role !== "ADMIN") {
return res.status(403).json({
message: "Accès réservé aux administrateurs.",
});
}


const [appointments] = await db.query(`
  SELECT
    ap.id AS appointment_id,
    ap.reason,
    ap.status,
    ap.meeting_url,
    a.start_time,
    a.end_time,
    TRIM(patient.first_name) AS patient_first_name,
    TRIM(patient.last_name) AS patient_last_name,
    TRIM(doctor.first_name) AS doctor_first_name,
    TRIM(doctor.last_name) AS doctor_last_name,
    s.name AS specialty_name
  FROM appointments ap
  INNER JOIN users patient
    ON patient.id = ap.patient_id
  INNER JOIN availabilities a
    ON a.id = ap.availability_id
  INNER JOIN doctor_profiles dp
    ON dp.id = a.doctor_profile_id
  INNER JOIN users doctor
    ON doctor.id = dp.user_id
  INNER JOIN specialties s
    ON s.id = dp.specialty_id
  ORDER BY a.start_time DESC
`);

return res.status(200).json({
  appointments,
});


} catch (error) {
console.error("Erreur rendez-vous administrateur :", error);


return res.status(500).json({
  message: "Impossible de récupérer les rendez-vous.",
});


}
};

module.exports = {
getAvailableSlots,
createAvailability,
getDoctorAvailabilities,
createAppointment,
getPatientAppointments,
getDoctorAppointments,
updateAppointmentStatus,
getAdminAppointments,
};
