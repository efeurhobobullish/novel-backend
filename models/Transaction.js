const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  type: { type: String, enum: ["purchase", "recharge"], required: true },
  status: { type: String, enum: ["pending", "success", "failed"], default: "pending" },
  coins: { type: Number, required: true },
  amount: { type: Number, required: true },
  reference: { type: String, unique: true },
  episodeId: { type: mongoose.Schema.Types.ObjectId, ref: "Episode" }
}, { timestamps: true });

module.exports = mongoose.model("Transaction", transactionSchema);
