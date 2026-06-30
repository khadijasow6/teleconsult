const express = require("express");

const {
  createConversation,
} = require("../controllers/messageController");

const {
  protect,
  authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// Créer ou récupérer une conversation
// Seuls les patients et les médecins peuvent accéder à cette route
router.post(
  "/conversations",
  protect,
  authorizeRoles("PATIENT", "MEDECIN"),
  createConversation
);

module.exports = router;