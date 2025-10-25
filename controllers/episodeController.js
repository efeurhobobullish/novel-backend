const Episode = require("../models/Episode");
const User = require("../models/User");
const Transaction = require("../models/Transaction");
const { io } = require("../server");

exports.getEpisode = async (req, res) => {
  const episode = await Episode.findById(req.params.id);
  res.json(episode);
};

exports.unlockEpisode = async (req, res) => {
  const user = await User.findById(req.user.id);
  const episode = await Episode.findById(req.params.id);

  if (episode.isFree) return res.json(episode);

  if (user.purchasedEpisodes.includes(episode._id)) {
    return res.json(episode);
  }

  if (user.coins < episode.price) return res.status(400).json({ error: "Not enough coins" });

  user.coins -= episode.price;
  user.purchasedEpisodes.push(episode._id);
  await user.save();

  const txn = await Transaction.create({
    userId: user._id,
    type: "purchase",
    coins: -episode.price,
    amount: 0,
    status: "success",
    reference: "purchase_" + Date.now(),
    episodeId: episode._id
  });

  io.emit("transactionUpdate", { userId: user._id, txn });

  res.json({ success: true, episode });
};