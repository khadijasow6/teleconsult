const express = require("express");

const {
  registerPatient,
  registerDoctor,
  login,
  requestPasswordReset,
  resetPassword,
} = require("../controllers/authController");
const {
  protect,
} = require("../middlewares/authMiddleware");

const {
  uploadProfilePhoto,
} = require("../middlewares/uploadMiddleware");

const {
  getMyProfile,
  updateProfilePhoto,
} = require("../controllers/profileController");

const router = express.Router();

// Inscription d'un patient
router.post("/register", registerPatient);

// Inscription d'un médecin
router.post("/register-doctor", registerDoctor);

// Connexion
router.post("/login", login);
// Demande de réinitialisation de mot de passe
router.post("/forgot-password", requestPasswordReset);

// Réinitialisation du mot de passe avec le token
router.post("/reset-password", resetPassword);

// Récupérer le profil complet
router.get("/profile", protect, getMyProfile);

// Modifier la photo de profil
router.patch(
  "/profile/photo",
  protect,
  uploadProfilePhoto.single("profile_photo"),
  updateProfilePhoto
);

module.exports = router;