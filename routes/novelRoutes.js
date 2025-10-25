const express = require("express");
const { getNovels } = require("../controllers/novelController");
const router = express.Router();

router.get("/", getNovels);

module.exports = router;