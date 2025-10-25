const Novel = require("../models/Novel");
const Episode = require("../models/Episode");

// Get all novels
exports.getNovels = async (req, res) => {
  try {
    const novels = await Novel.find().select("title genre cover description");
    res.json(novels);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get novel details + episode list
exports.getNovel = async (req, res) => {
  try {
    const novel = await Novel.findById(req.params.id).populate("episodes", "title isFree price");
    if (!novel) return res.status(404).json({ error: "Novel not found" });
    novel.views += 1;
    await novel.save();
    res.json(novel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get episode (check free/paid later)
exports.getEpisode = async (req, res) => {
  try {
    const episode = await Episode.findById(req.params.id);
    if (!episode) return res.status(404).json({ error: "Episode not found" });
    res.json(episode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
