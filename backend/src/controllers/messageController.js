const pool = require("../config/db");

// Crée une conversation ou récupère celle qui existe déjà
const createConversation = async (req, res) => {
  try {
    // Utilisateur actuellement connecté
    const currentUserId = req.user.id;
    const currentUserRole = req.user.role;

    // Identifiant de la personne avec qui on veut discuter
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: "L’utilisateur destinataire est obligatoire.",
      });
    }

    if (Number(user_id) === Number(currentUserId)) {
      return res.status(400).json({
        success: false,
        message: "Vous ne pouvez pas discuter avec vous-même.",
      });
    }

    // Vérifie que le destinataire existe
    const [users] = await pool.query(
      `
        SELECT id, role, first_name, last_name
        FROM users
        WHERE id = ?
      `,
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    const otherUser = users[0];

    let patientId;
    let doctorId;

    // Le patient doit discuter uniquement avec un médecin
    if (
      currentUserRole === "PATIENT" &&
      otherUser.role === "MEDECIN"
    ) {
      patientId = currentUserId;
      doctorId = otherUser.id;
    }

    // Le médecin doit discuter uniquement avec un patient
    else if (
      currentUserRole === "MEDECIN" &&
      otherUser.role === "PATIENT"
    ) {
      patientId = otherUser.id;
      doctorId = currentUserId;
    }

    // Toute autre combinaison est refusée
    else {
      return res.status(403).json({
        success: false,
        message:
          "Une conversation est autorisée uniquement entre un patient et un médecin.",
      });
    }

    // Crée la conversation si elle n’existe pas encore.
    // Sinon, récupère son identifiant.
    const [result] = await pool.query(
      `
        INSERT INTO conversations (
          patient_id,
          doctor_id
        )
        VALUES (?, ?)

        ON DUPLICATE KEY UPDATE
          id = LAST_INSERT_ID(id)
      `,
      [patientId, doctorId]
    );

    const conversationId = result.insertId;

    return res.status(200).json({
      success: true,
      message: "Conversation prête.",
      conversation_id: conversationId,
    });
  } catch (error) {
    console.error(
      "Erreur création conversation :",
      error
    );

    return res.status(500).json({
      success: false,
      message: "Impossible de créer la conversation.",
    });
  }
};

module.exports = {
  createConversation,
};