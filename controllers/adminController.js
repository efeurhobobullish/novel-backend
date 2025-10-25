const Novel = require("../models/Novel");
const Episode = require("../models/Episode");

// Create novel
exports.createNovel = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Not authorized" });

    const { title, genre, cover, description } = req.body;
    const novel = await Novel.create({ title, genre, cover, description });
    res.status(201).json(novel);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Add episode
exports.addEpisode = async (req, res) => {
  try {
    if (req.user.role !== "admin") return res.status(403).json({ error: "Not authorized" });

    const { novelId, title, content, isFree, price } = req.body;
    const episode = await Episode.create({ novelId, title, content, isFree, price });

    await Novel.findByIdAndUpdate(novelId, { $push: { episodes: episode._id } });
    res.status(201).json(episode);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
