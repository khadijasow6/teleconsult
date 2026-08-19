const express = require("express");

const {
  getPatientMedicalHistory,
  getPatientMedicalHistoryForDoctor,
} = require("../controllers/medicalHistoryController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/", getPatientMedicalHistory);
router.get("/patient/:patientId", getPatientMedicalHistoryForDoctor);

module.exports = router;