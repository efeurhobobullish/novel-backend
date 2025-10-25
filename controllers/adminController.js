const Novel = require("../models/Novel");
const Episode = require("../models/Episode");

exports.createNovel = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Not authorized" });
  const novel = await Novel.create(req.body);
  res.json(novel);
};

exports.addEpisode = async (req, res) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Not authorized" });
  const { novelId, title, content, isFree, price } = req.body;
  const episode = await Episode.create({ novelId, title, content, isFree, price });
  await Novel.findByIdAndUpdate(novelId, { $push: { episodes: episode._id } });
  res.json(episode);
};