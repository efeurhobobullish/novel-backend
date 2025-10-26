const express = require("express");
const auth = require("../middleware/authMiddleware");
const { initializePayment, verifyPayment } = require("../controllers/walletController");
const router = express.Router();

router.post("/pay", auth, initializePayment);
router.get("/verify/:reference", auth, verifyPayment);

module.exports = router;
