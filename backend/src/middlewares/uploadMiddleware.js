const multer = require("multer");
const path = require("path");

// Configuration de l'endroit où les photos seront enregistrées
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(
      null,
      path.join(__dirname, "../../uploads/profiles")
    );
  },

  // Création d'un nom unique pour éviter les doublons
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);

    const uniqueName =
      `profile-${req.user.id}-${Date.now()}${extension}`;

    cb(null, uniqueName);
  },
});

// Vérifie que le fichier envoyé est bien une image
const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/jpg",
    "image/png",
    "image/webp",
  ];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Format non autorisé. Utilisez JPG, PNG ou WEBP."
      ),
      false
    );
  }
};

// Configuration finale de Multer
const uploadProfilePhoto = multer({
  storage,
  fileFilter,

  // Taille maximale : 2 Mo
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
});

module.exports = {
  uploadProfilePhoto,
};