const express = require("express");

const {
createPrescription,
getPatientPrescriptions,
generatePrescriptionPdf,
} = require("../controllers/prescriptionController");

const {
protect,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createPrescription);
router.get("/patient", getPatientPrescriptions);
router.get("/:id/pdf", generatePrescriptionPdf);

module.exports = router;