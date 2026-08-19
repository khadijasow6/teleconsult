const express = require("express");

const {
  initiatePayment,
  confirmPayment,
  getPaymentForAppointment,
} = require("../controllers/paymentController");

const { protect } = require("../middlewares/authMiddleware");

const router = express.Router();

router.use(protect);

router.post("/initiate", initiatePayment);
router.post("/confirm", confirmPayment);
router.get("/appointment/:appointmentId", getPaymentForAppointment);

module.exports = router;