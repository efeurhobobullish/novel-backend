const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema({
  title: { type: String, required: true },
  cover: String,
  genre: String,
  description: String,
  episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
  views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model("Novel", novelSchema);