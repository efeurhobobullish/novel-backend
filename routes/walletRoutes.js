const express = require("express");
const { initiateRecharge, paystackWebhook, getWallet } = require("../controllers/walletController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/recharge", auth, initiateRecharge);
router.get("/", auth, getWallet);
router.post("/webhook", paystackWebhook);

module.exports = router;
