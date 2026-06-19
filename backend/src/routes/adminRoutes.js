const express = require("express");

const {
getAdminDashboard,
updateDoctorValidationStatus,
} = require("../controllers/adminController");

const {
protect,
authorizeRoles,
} = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorizeRoles("ADMIN"));

router.get("/dashboard", getAdminDashboard);

router.patch(
"/doctors/:id/status",
updateDoctorValidationStatus
);

module.exports = router;
