const pool = require("../config/db");

// Récupère le profil complet de l'utilisateur connecté
const getMyProfile = async (req, res) => {
  try {
    // L'identifiant vient du token JWT
    const userId = req.user.id;

    // Si l'utilisateur est un médecin,
    // on récupère aussi ses informations professionnelles
    if (req.user.role === "MEDECIN") {
      const [doctors] = await pool.query(
        `
          SELECT
            u.id,
            u.first_name,
            u.last_name,
            u.email,
            u.phone,
            u.profile_photo,
            u.role,
            u.is_active,

            dp.id AS doctor_profile_id,
            dp.specialty_id,
            s.name AS specialty_name,
            dp.license_number,
            dp.biography,
            dp.years_of_experience,
            dp.consultation_price,
            dp.validation_status

          FROM users u

          INNER JOIN doctor_profiles dp
            ON dp.user_id = u.id

          INNER JOIN specialties s
            ON s.id = dp.specialty_id

          WHERE u.id = ?
        `,
        [userId]
      );

      if (doctors.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Profil médecin introuvable.",
        });
      }

      return res.status(200).json({
        success: true,
        user: doctors[0],
      });
    }

    // Pour un patient ou un administrateur
    const [users] = await pool.query(
      `
        SELECT
          id,
          first_name,
          last_name,
          email,
          phone,
          profile_photo,
          role,
          is_active

        FROM users
        WHERE id = ?
      `,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    return res.status(200).json({
      success: true,
      user: users[0],
    });
  } catch (error) {
    console.error("Erreur récupération profil :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de récupérer le profil.",
    });
  }
};
// Enregistre la photo de profil de l'utilisateur connecté
const updateProfilePhoto = async (req, res) => {
  try {
    // Vérifie qu'une image a bien été envoyée
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Veuillez sélectionner une photo.",
      });
    }

    // Chemin qui sera enregistré dans MySQL
    const photoPath = `/uploads/profiles/${req.file.filename}`;

    // Mise à jour de la photo dans la table users
    await pool.query(
      `
        UPDATE users
        SET profile_photo = ?
        WHERE id = ?
      `,
      [photoPath, req.user.id]
    );

    return res.status(200).json({
      success: true,
      message: "Photo de profil mise à jour avec succès.",
      profile_photo: photoPath,
    });
  } catch (error) {
    console.error("Erreur mise à jour photo :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de mettre à jour la photo.",
    });
  }
};
module.exports = {
  getMyProfile,
  updateProfilePhoto,
};