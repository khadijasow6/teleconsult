const express = require("express");

const {
getAvailableSlots,
createAvailability,
getDoctorAvailabilities,
createAppointment,
getPatientAppointments,
getDoctorAppointments,
updateAppointmentStatus,
getAdminAppointments,
} = require("../controllers/appointmentController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.get("/available-slots", getAvailableSlots);

router.post("/availabilities", createAvailability);

router.get(
"/doctor/availabilities",
getDoctorAvailabilities
);

router.get("/patient", getPatientAppointments);

router.get("/doctor", getDoctorAppointments);

router.get("/admin", getAdminAppointments);

router.post("/", createAppointment);

router.patch("/:id/status", updateAppointmentStatus);

module.exports = router;
