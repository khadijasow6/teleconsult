const express = require("express");

const {
createPrescription,
getPatientPrescriptions,
} = require("../controllers/prescriptionController");

const {
protect,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/", createPrescription);
router.get("/patient", getPatientPrescriptions);

module.exports = router;
