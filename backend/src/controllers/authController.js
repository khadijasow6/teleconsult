const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

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

module.exports = {
registerPatient,
registerDoctor,
login,
};
