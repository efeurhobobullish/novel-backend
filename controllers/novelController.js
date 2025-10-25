const Novel = require("../models/Novel");

exports.getNovels = async (req, res) => {
  const novels = await Novel.find().populate("episodes");
  res.json(novels);
};
