const mongoose = require("mongoose");

const episodeSchema = new mongoose.Schema(
  {
    novelId: { type: mongoose.Schema.Types.ObjectId, ref: "Novel", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    isFree: { type: Boolean, default: false },
    price: { type: Number, default: 0 }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Episode", episodeSchema);
