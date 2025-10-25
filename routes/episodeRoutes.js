const express = require("express");
const { getEpisode, unlockEpisode } = require("../controllers/episodeController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/:id", auth, getEpisode);
router.post("/:id/unlock", auth, unlockEpisode);

module.exports = router;
