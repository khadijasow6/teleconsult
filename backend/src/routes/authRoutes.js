const express = require("express");

const {
  registerPatient,
  registerDoctor,
  login,
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