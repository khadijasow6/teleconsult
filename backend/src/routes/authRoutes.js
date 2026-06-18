const express = require("express");

const {
  registerPatient,
  login,
} = require("../controllers/authController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/register", registerPatient);

router.post("/login", login);

router.get("/profile", protect, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Vous êtes authentifié",
    user: req.user,
  });
});

module.exports = router;