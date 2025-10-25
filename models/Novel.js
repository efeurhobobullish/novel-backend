const mongoose = require("mongoose");

const novelSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    genre: { type: String },
    cover: { type: String }, // image url
    description: { type: String },
    episodes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Episode" }],
    views: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Novel", novelSchema);
