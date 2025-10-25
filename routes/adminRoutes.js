const express = require("express");
const { createNovel, addEpisode } = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/novel", auth, createNovel);
router.post("/episode", auth, addEpisode);

module.exports = router;
