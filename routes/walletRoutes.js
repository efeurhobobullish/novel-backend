const express = require("express");
const { fakeRecharge, getWallet } = require("../controllers/walletController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/recharge", auth, fakeRecharge);
router.get("/", auth, getWallet);

module.exports = router;