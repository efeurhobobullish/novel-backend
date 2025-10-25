const Transaction = require("../models/Transaction");
const User = require("../models/User");
const { io } = require("../server");

// ✅ Fake recharge (demo)
exports.fakeRecharge = async (req, res) => {
  try {
    const { coins, amount } = req.body;

    const user = await User.findById(req.user.id);
    user.coins += coins;
    await user.save();

    const txn = await Transaction.create({
      userId: user._id,
      type: "recharge",
      coins,
      amount: amount || 0,
      status: "success",
      reference: "demo_" + Date.now()
    });

    io.emit("transactionUpdate", { userId: user._id, txn });
    res.json({ success: true, balance: user.coins, txn });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getWallet = async (req, res) => {
  const user = await User.findById(req.user.id);
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ balance: user.coins, transactions });
};