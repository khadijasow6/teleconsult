const db = require("../config/db");

const getDoctors = async (req, res) => {
try {
const [doctors] = await db.query(`       SELECT
        dp.id AS doctor_profile_id,
        u.id AS user_id,
        u.first_name,
        u.last_name,
        u.email,
        u.phone,
        s.id AS specialty_id,
        s.name AS specialty_name,
        dp.license_number,
        dp.biography,
        dp.years_of_experience,
        dp.consultation_price,
        dp.validation_status
      FROM doctor_profiles dp
      INNER JOIN users u ON u.id = dp.user_id
      INNER JOIN specialties s ON s.id = dp.specialty_id
      WHERE dp.validation_status = 'VALIDE'
      ORDER BY u.first_name ASC, u.last_name ASC
    `);


return res.status(200).json({
  doctors,
});


} catch (error) {
console.error("Erreur récupération médecins :", error);


return res.status(500).json({
  message: "Impossible de récupérer les médecins.",
});


}
};

const getDoctorById = async (req, res) => {
try {
const doctorId = req.params.id;


const [doctors] = await db.query(
  `
    SELECT
      dp.id AS doctor_profile_id,
      u.id AS user_id,
      u.first_name,
      u.last_name,
      u.email,
      u.phone,
      s.id AS specialty_id,
      s.name AS specialty_name,
      dp.license_number,
      dp.biography,
      dp.years_of_experience,
      dp.consultation_price,
      dp.validation_status
    FROM doctor_profiles dp
    INNER JOIN users u ON u.id = dp.user_id
    INNER JOIN specialties s ON s.id = dp.specialty_id
    WHERE dp.id = ?
    AND dp.validation_status = 'VALIDE'
  `,
  [doctorId]
);

if (doctors.length === 0) {
  return res.status(404).json({
    message: "Médecin introuvable.",
  });
}

return res.status(200).json({
  doctor: doctors[0],
});


} catch (error) {
console.error("Erreur récupération médecin :", error);


return res.status(500).json({
  message: "Impossible de récupérer ce médecin.",
});


}
};

module.exports = {
getDoctors,
getDoctorById,
};
