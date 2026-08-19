const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const pool = require("../config/db");
const { notifyUser } = require("../utils/notify");

// Création du token JWT
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user.id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_EXPIRES_IN,
    }
  );
};

// Inscription d'un patient
const registerPatient = async (req, res) => {
  try {
    const { first_name, last_name, email, password, phone } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Tous les champs obligatoires doivent être remplis",
      });
    }

    const [existingUsers] = await pool.query(
      "SELECT id FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return res.status(409).json({
        success: false,
        message: "Cette adresse e-mail est déjà utilisée",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const [result] = await pool.query(
      `INSERT INTO users
      (first_name, last_name, email, password, phone, role)
      VALUES (?, ?, ?, ?, ?, 'PATIENT')`,
      [first_name, last_name, email, hashedPassword, phone || null]
    );

    const user = {
      id: result.insertId,
      first_name,
      last_name,
      email,
      role: "PATIENT",
    };
if (user.role === "MEDECIN") {
const [doctorProfiles] = await pool.query(
`       SELECT validation_status
      FROM doctor_profiles
      WHERE user_id = ?
    `,
[user.id]
);

if (doctorProfiles.length === 0) {
return res.status(403).json({
success: false,
message:
"Votre profil médecin est introuvable. Contactez l’administrateur.",
});
}

const validationStatus =
doctorProfiles[0].validation_status;

if (validationStatus === "EN_ATTENTE") {
return res.status(403).json({
success: false,
message:
"Votre compte médecin est en attente de validation par l’administrateur.",
});
}

if (validationStatus === "REFUSE") {
return res.status(403).json({
success: false,
message:
"Votre demande d’inscription comme médecin a été refusée.",
});
}
}

    const token = generateToken(user);

    return res.status(201).json({
      success: true,
      message: "Compte patient créé avec succès",
      token,
      user,
    });
  } catch (error) {
    console.error("Erreur inscription :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};
const registerDoctor = async (req, res) => {
let connection;

try {
const {
first_name,
last_name,
email,
password,
phone,
specialty_id,
license_number,
biography,
years_of_experience,
consultation_price,
} = req.body;


if (
  !first_name ||
  !last_name ||
  !email ||
  !password ||
  !specialty_id ||
  !license_number
) {
  return res.status(400).json({
    success: false,
    message:
      "Veuillez remplir tous les champs obligatoires.",
  });
}

connection = await pool.getConnection();
await connection.beginTransaction();

const [existingUsers] = await connection.query(
  "SELECT id FROM users WHERE email = ?",
  [email]
);

if (existingUsers.length > 0) {
  await connection.rollback();

  return res.status(409).json({
    success: false,
    message:
      "Cette adresse e-mail est déjà utilisée.",
  });
}

const [existingLicenses] = await connection.query(
  `
    SELECT id
    FROM doctor_profiles
    WHERE license_number = ?
  `,
  [license_number]
);

if (existingLicenses.length > 0) {
  await connection.rollback();

  return res.status(409).json({
    success: false,
    message:
      "Ce numéro de licence est déjà utilisé.",
  });
}

const [specialties] = await connection.query(
  "SELECT id FROM specialties WHERE id = ?",
  [specialty_id]
);

if (specialties.length === 0) {
  await connection.rollback();

  return res.status(404).json({
    success: false,
    message:
      "La spécialité sélectionnée est introuvable.",
  });
}

const hashedPassword = await bcrypt.hash(
  password,
  10
);

const [userResult] = await connection.query(
  `
    INSERT INTO users
    (
      first_name,
      last_name,
      email,
      password,
      phone,
      role
    )
    VALUES (?, ?, ?, ?, ?, 'MEDECIN')
  `,
  [
    first_name,
    last_name,
    email,
    hashedPassword,
    phone || null,
  ]
);

await connection.query(
  `
    INSERT INTO doctor_profiles
    (
      user_id,
      specialty_id,
      license_number,
      biography,
      years_of_experience,
      consultation_price,
      validation_status
    )
    VALUES (?, ?, ?, ?, ?, ?, 'EN_ATTENTE')
  `,
  [
    userResult.insertId,
    specialty_id,
    license_number,
    biography || null,
    Number(years_of_experience) || 0,
    Number(consultation_price) || 0,
  ]
);

await connection.commit();

return res.status(201).json({
  success: true,
  message:
    "Votre demande d’inscription a été envoyée. Un administrateur doit valider votre compte.",
});


} catch (error) {
if (connection) {
await connection.rollback();
}


console.error(
  "Erreur inscription médecin :",
  error
);

return res.status(500).json({
  success: false,
  message:
    "Impossible de créer le compte médecin.",
});


} finally {
if (connection) {
connection.release();
}
}
};


// Connexion d'un utilisateur
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "L’adresse e-mail et le mot de passe sont obligatoires",
      });
    }

    const [users] = await pool.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Adresse e-mail ou mot de passe incorrect",
      });
    }

    const user = users[0];

    if (!user.is_active) {
      return res.status(403).json({
        success: false,
        message: "Votre compte est désactivé",
      });
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordIsValid) {
      return res.status(401).json({
        success: false,
        message: "Adresse e-mail ou mot de passe incorrect",
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      success: true,
      message: "Connexion réussie",
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Erreur connexion :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur interne du serveur",
    });
  }
};
// Demande de réinitialisation de mot de passe
const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "L'adresse e-mail est obligatoire.",
      });
    }

    const [users] = await pool.query(
      "SELECT id, first_name, last_name, email FROM users WHERE email = ? LIMIT 1",
      [email]
    );

    // Pour ne pas révéler si l'e-mail existe ou non (sécurité),
    // on répond toujours le même message, qu'un compte existe ou pas.
    if (users.length === 0) {
      return res.status(200).json({
        success: true,
        message:
          "Si cette adresse existe, un e-mail de réinitialisation a été envoyé.",
      });
    }

    const user = users[0];

    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 heure

    await pool.query(
      `
        INSERT INTO password_resets (user_id, token, expires_at)
        VALUES (?, ?, ?)
      `,
      [user.id, token, expiresAt]
    );

    const resetLink = `${
      process.env.FRONTEND_URL || "http://localhost:5173"
    }/reset-password?token=${token}`;

    await notifyUser({
      userId: user.id,
      type: "RENDEZ_VOUS_CREE",
      title: "Réinitialisation de mot de passe",
      message:
        "Une demande de réinitialisation de mot de passe a été effectuée.",
      email: user.email,
      emailSubject: "SamaSanté — Réinitialisation de votre mot de passe",
      emailHtml: `
        <div style="font-family: Arial, sans-serif; color: #173b5c;">
          <h2 style="color: #176baf;">Réinitialisation de mot de passe</h2>
          <p>Bonjour ${user.first_name},</p>
          <p>Vous avez demandé à réinitialiser votre mot de passe SamaSanté. Cliquez sur le lien ci-dessous pour choisir un nouveau mot de passe (valable 1 heure) :</p>
          <p>
            <a href="${resetLink}" style="display:inline-block;padding:12px 20px;background-color:#176baf;color:#ffffff;border-radius:8px;text-decoration:none;">
              Réinitialiser mon mot de passe
            </a>
          </p>
          <p>Si vous n'êtes pas à l'origine de cette demande, ignorez simplement cet e-mail.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
      message:
        "Si cette adresse existe, un e-mail de réinitialisation a été envoyé.",
    });
  } catch (error) {
    console.error("Erreur demande réinitialisation :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de traiter cette demande.",
    });
  }
};

// Réinitialisation effective du mot de passe
const resetPassword = async (req, res) => {
  try {
    const { token, new_password } = req.body;

    if (!token || !new_password) {
      return res.status(400).json({
        success: false,
        message: "Le token et le nouveau mot de passe sont obligatoires.",
      });
    }

    if (new_password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Le mot de passe doit contenir au moins 6 caractères.",
      });
    }

    const [resets] = await pool.query(
      `
        SELECT id, user_id, expires_at, used
        FROM password_resets
        WHERE token = ?
        LIMIT 1
      `,
      [token]
    );

    if (resets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Ce lien de réinitialisation est invalide.",
      });
    }

    const resetRequest = resets[0];

    if (resetRequest.used) {
      return res.status(400).json({
        success: false,
        message: "Ce lien de réinitialisation a déjà été utilisé.",
      });
    }

    if (new Date(resetRequest.expires_at) < new Date()) {
      return res.status(400).json({
        success: false,
        message: "Ce lien de réinitialisation a expiré.",
      });
    }

    const hashedPassword = await bcrypt.hash(new_password, 10);

    await pool.query("UPDATE users SET password = ? WHERE id = ?", [
      hashedPassword,
      resetRequest.user_id,
    ]);

    await pool.query(
      "UPDATE password_resets SET used = TRUE WHERE id = ?",
      [resetRequest.id]
    );

    return res.status(200).json({
      success: true,
      message: "Votre mot de passe a été réinitialisé avec succès.",
    });
  } catch (error) {
    console.error("Erreur réinitialisation mot de passe :", error);

    return res.status(500).json({
      success: false,
      message: "Impossible de réinitialiser le mot de passe.",
    });
  }
};

module.exports = {
  registerPatient,
  registerDoctor,
  login,
  requestPasswordReset,
  resetPassword,
  };
