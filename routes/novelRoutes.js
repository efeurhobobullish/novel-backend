const express = require("express");
const { getNovels, getNovel, getEpisode } = require("../controllers/novelController");
const router = express.Router();

router.get("/", getNovels);
router.get("/:id", getNovel);
router.get("/episode/:id", getEpisode);

module.exports = router;
