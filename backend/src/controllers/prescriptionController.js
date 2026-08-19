const PDFDocument = require("pdfkit");
const db = require("../config/db");
const { notifyUser } = require("../utils/notify");

const getUserId = (req) =>
req.user?.id || req.user?.userId || req.user?.user_id;

const createPrescription = async (req, res) => {
const connection = await db.getConnection();

try {
const doctorUserId = getUserId(req);


if (req.user?.role !== "MEDECIN") {
  return res.status(403).json({
    message: "Accès réservé aux médecins.",
  });
}

const {
  appointment_id,
  symptoms,
  diagnosis,
  doctor_notes,
  instructions,
  additional_notes,
  items,
} = req.body;

if (!appointment_id || !diagnosis) {
  return res.status(400).json({
    message:
      "Le rendez-vous et le diagnostic sont obligatoires.",
  });
}

if (!Array.isArray(items) || items.length === 0) {
  return res.status(400).json({
    message: "Ajoutez au moins un médicament.",
  });
}

const invalidItem = items.find(
  (item) =>
    !item.medication_name ||
    !item.dosage ||
    !item.frequency ||
    !item.duration
);

if (invalidItem) {
  return res.status(400).json({
    message:
      "Le nom, le dosage, la fréquence et la durée sont obligatoires.",
  });
}

await connection.beginTransaction();

const [appointments] = await connection.query(
  `
    SELECT
      ap.id,
      ap.status,
      patient.id AS patient_user_id,
      patient.email AS patient_email,
      TRIM(doctor.first_name) AS doctor_first_name,
      TRIM(doctor.last_name) AS doctor_last_name
    FROM appointments ap
    INNER JOIN availabilities a
      ON a.id = ap.availability_id
    INNER JOIN doctor_profiles dp
      ON dp.id = a.doctor_profile_id
    INNER JOIN users doctor
      ON doctor.id = dp.user_id
    INNER JOIN users patient
      ON patient.id = ap.patient_id
    WHERE ap.id = ?
      AND dp.user_id = ?
    LIMIT 1
  `,
  [appointment_id, doctorUserId]
);

if (appointments.length === 0) {
  await connection.rollback();

  return res.status(404).json({
    message: "Rendez-vous introuvable.",
  });
}

if (
  !["CONFIRME", "TERMINE"].includes(
    appointments[0].status
  )
) {
  await connection.rollback();

  return res.status(400).json({
    message:
      "Le rendez-vous doit être confirmé avant de créer une ordonnance.",
  });
}

const [consultationResult] = await connection.query(
  `
    INSERT INTO consultations (
      appointment_id,
      symptoms,
      diagnosis,
      doctor_notes,
      started_at,
      ended_at
    )
    VALUES (?, ?, ?, ?, NOW(), NOW())
    ON DUPLICATE KEY UPDATE
      id = LAST_INSERT_ID(id),
      symptoms = VALUES(symptoms),
      diagnosis = VALUES(diagnosis),
      doctor_notes = VALUES(doctor_notes),
      ended_at = NOW()
  `,
  [
    appointment_id,
    symptoms?.trim() || null,
    diagnosis.trim(),
    doctor_notes?.trim() || null,
  ]
);

const consultationId = consultationResult.insertId;

const [prescriptionResult] = await connection.query(
  `
    INSERT INTO prescriptions (
      consultation_id,
      instructions,
      additional_notes,
      issued_at
    )
    VALUES (?, ?, ?, NOW())
    ON DUPLICATE KEY UPDATE
      id = LAST_INSERT_ID(id),
      instructions = VALUES(instructions),
      additional_notes = VALUES(additional_notes),
      issued_at = NOW()
  `,
  [
    consultationId,
    instructions?.trim() || null,
    additional_notes?.trim() || null,
  ]
);

const prescriptionId = prescriptionResult.insertId;

await connection.query(
  `
    DELETE FROM prescription_items
    WHERE prescription_id = ?
  `,
  [prescriptionId]
);

for (const item of items) {
  await connection.query(
    `
      INSERT INTO prescription_items (
        prescription_id,
        medication_name,
        dosage,
        frequency,
        duration,
        instructions
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `,
    [
      prescriptionId,
      item.medication_name.trim(),
      item.dosage.trim(),
      item.frequency.trim(),
      item.duration.trim(),
      item.instructions?.trim() || null,
    ]
  );
}

await connection.query(
  `
    UPDATE appointments
    SET status = 'TERMINE'
    WHERE id = ?
  `,
  [appointment_id]
);

await connection.commit();

const appointmentInfo = appointments[0];
const doctorFullName = `Dr ${appointmentInfo.doctor_first_name} ${appointmentInfo.doctor_last_name}`;

await notifyUser({
  userId: appointmentInfo.patient_user_id,
  type: "ORDONNANCE_DISPONIBLE",
  title: "Nouvelle ordonnance disponible",
  message: `${doctorFullName} a rédigé une ordonnance suite à votre consultation. Vous pouvez la consulter depuis votre tableau de bord.`,
  appointmentId: appointment_id,
  email: appointmentInfo.patient_email,
  emailSubject: "SamaSanté — Votre ordonnance est disponible",
});

return res.status(201).json({
  message: "Ordonnance enregistrée avec succès.",
  prescription_id: prescriptionId,
});


} catch (error) {
await connection.rollback();


console.error("Erreur création ordonnance :", error);

return res.status(500).json({
  message: "Impossible de créer l’ordonnance.",
});


} finally {
connection.release();
}
};

const getPatientPrescriptions = async (req, res) => {
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
      p.id AS prescription_id,
      p.instructions AS prescription_instructions,
      p.additional_notes,
      p.issued_at,
      c.symptoms,
      c.diagnosis,
      c.doctor_notes,
      ap.id AS appointment_id,
      a.start_time,
      TRIM(doctor.first_name) AS doctor_first_name,
      TRIM(doctor.last_name) AS doctor_last_name,
      s.name AS specialty_name,
      pi.id AS item_id,
      pi.medication_name,
      pi.dosage,
      pi.frequency,
      pi.duration,
      pi.instructions AS medication_instructions
    FROM prescriptions p
    INNER JOIN consultations c
      ON c.id = p.consultation_id
    INNER JOIN appointments ap
      ON ap.id = c.appointment_id
    INNER JOIN availabilities a
      ON a.id = ap.availability_id
    INNER JOIN doctor_profiles dp
      ON dp.id = a.doctor_profile_id
    INNER JOIN users doctor
      ON doctor.id = dp.user_id
    INNER JOIN specialties s
      ON s.id = dp.specialty_id
    LEFT JOIN prescription_items pi
      ON pi.prescription_id = p.id
    WHERE ap.patient_id = ?
    ORDER BY p.issued_at DESC, pi.id ASC
  `,
  [patientId]
);

const prescriptionsMap = new Map();

rows.forEach((row) => {
  if (!prescriptionsMap.has(row.prescription_id)) {
    prescriptionsMap.set(row.prescription_id, {
      prescription_id: row.prescription_id,
      appointment_id: row.appointment_id,
      prescription_instructions:
        row.prescription_instructions,
      additional_notes: row.additional_notes,
      issued_at: row.issued_at,
      symptoms: row.symptoms,
      diagnosis: row.diagnosis,
      doctor_notes: row.doctor_notes,
      start_time: row.start_time,
      doctor_first_name: row.doctor_first_name,
      doctor_last_name: row.doctor_last_name,
      specialty_name: row.specialty_name,
      items: [],
    });
  }

  if (row.item_id) {
    prescriptionsMap
      .get(row.prescription_id)
      .items.push({
        item_id: row.item_id,
        medication_name: row.medication_name,
        dosage: row.dosage,
        frequency: row.frequency,
        duration: row.duration,
        instructions: row.medication_instructions,
      });
  }
});

return res.status(200).json({
  prescriptions: Array.from(
    prescriptionsMap.values()
  ),
});


} catch (error) {
console.error(
"Erreur récupération ordonnances patient :",
error
);


return res.status(500).json({
  message: "Impossible de récupérer vos ordonnances.",
});


}
};
const generatePrescriptionPdf = async (req, res) => {
  try {
    const userId = getUserId(req);
    const prescriptionId = req.params.id;

    const [rows] = await db.query(
      `
        SELECT
          p.id AS prescription_id,
          p.instructions AS prescription_instructions,
          p.additional_notes,
          p.issued_at,
          c.symptoms,
          c.diagnosis,
          c.doctor_notes,
          ap.id AS appointment_id,
          ap.patient_id,
          a.start_time,
          TRIM(patient.first_name) AS patient_first_name,
          TRIM(patient.last_name) AS patient_last_name,
          TRIM(doctor.first_name) AS doctor_first_name,
          TRIM(doctor.last_name) AS doctor_last_name,
          doctor_user.id AS doctor_user_id,
          dp.license_number,
          s.name AS specialty_name,
          pi.medication_name,
          pi.dosage,
          pi.frequency,
          pi.duration,
          pi.instructions AS medication_instructions
        FROM prescriptions p
        INNER JOIN consultations c
          ON c.id = p.consultation_id
        INNER JOIN appointments ap
          ON ap.id = c.appointment_id
        INNER JOIN availabilities a
          ON a.id = ap.availability_id
        INNER JOIN doctor_profiles dp
          ON dp.id = a.doctor_profile_id
        INNER JOIN users doctor_user
          ON doctor_user.id = dp.user_id
        INNER JOIN users doctor
          ON doctor.id = dp.user_id
        INNER JOIN users patient
          ON patient.id = ap.patient_id
        INNER JOIN specialties s
          ON s.id = dp.specialty_id
        LEFT JOIN prescription_items pi
          ON pi.prescription_id = p.id
        WHERE p.id = ?
        ORDER BY pi.id ASC
      `,
      [prescriptionId]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Ordonnance introuvable.",
      });
    }

    const prescription = rows[0];

    const isOwnerPatient = prescription.patient_id === userId;
    const isOwnerDoctor = prescription.doctor_user_id === userId;

    if (!isOwnerPatient && !isOwnerDoctor) {
      return res.status(403).json({
        message: "Accès non autorisé à cette ordonnance.",
      });
    }

    const doc = new PDFDocument({ margin: 50 });

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=ordonnance-${prescriptionId}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");

    doc.pipe(res);

    // En-tête
    doc
      .fontSize(20)
      .fillColor("#176baf")
      .text("SamaSanté", { align: "left" })
      .fontSize(10)
      .fillColor("#666666")
      .text("Prise de rendez-vous médicaux en ligne", { align: "left" })
      .moveDown(1.5);

    doc
      .fontSize(16)
      .fillColor("#173b5c")
      .text("Ordonnance médicale", { align: "center" })
      .moveDown(1);

    doc
      .fontSize(10)
      .fillColor("#000000")
      .text(
        `Date de délivrance : ${new Date(
          prescription.issued_at
        ).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      )
      .moveDown(1);

    // Informations médecin / patient
    doc
      .fontSize(11)
      .fillColor("#176baf")
      .text("Médecin", { underline: true })
      .fillColor("#000000")
      .fontSize(10)
      .text(
        `Dr ${prescription.doctor_first_name} ${prescription.doctor_last_name}`
      )
      .text(`Spécialité : ${prescription.specialty_name}`)
      .text(`N° de licence : ${prescription.license_number}`)
      .moveDown(1);

    doc
      .fontSize(11)
      .fillColor("#176baf")
      .text("Patient", { underline: true })
      .fillColor("#000000")
      .fontSize(10)
      .text(
        `${prescription.patient_first_name} ${prescription.patient_last_name}`
      )
      .moveDown(1);

    if (prescription.diagnosis) {
      doc
        .fontSize(11)
        .fillColor("#176baf")
        .text("Diagnostic", { underline: true })
        .fillColor("#000000")
        .fontSize(10)
        .text(prescription.diagnosis)
        .moveDown(1);
    }

    // Médicaments
    doc
      .fontSize(11)
      .fillColor("#176baf")
      .text("Prescription", { underline: true })
      .moveDown(0.5);

    rows.forEach((row, index) => {
      if (!row.medication_name) return;

      doc
        .fontSize(10)
        .fillColor("#000000")
        .text(`${index + 1}. ${row.medication_name}`, { continued: false })
        .fillColor("#555555")
        .text(
          `   Dosage : ${row.dosage}  •  Fréquence : ${row.frequency}  •  Durée : ${row.duration}`
        );

      if (row.medication_instructions) {
        doc.text(`   Instructions : ${row.medication_instructions}`);
      }

      doc.moveDown(0.5);
    });

    if (prescription.additional_notes) {
      doc
        .moveDown(0.5)
        .fontSize(11)
        .fillColor("#176baf")
        .text("Notes complémentaires", { underline: true })
        .fillColor("#000000")
        .fontSize(10)
        .text(prescription.additional_notes)
        .moveDown(1);
    }

    doc
      .moveDown(2)
      .fontSize(9)
      .fillColor("#999999")
      .text(
        "Document généré électroniquement via la plateforme SamaSanté.",
        { align: "center" }
      );

    doc.end();
  } catch (error) {
    console.error("Erreur génération PDF ordonnance :", error);

    return res.status(500).json({
      message: "Impossible de générer le PDF.",
    });
  }
};
module.exports = {
  createPrescription,
  getPatientPrescriptions,
  generatePrescriptionPdf,
  };