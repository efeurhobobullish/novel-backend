const express = require("express");
const { register, login, getDashboard } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/dashboard", auth, getDashboard);

module.exports = router;
