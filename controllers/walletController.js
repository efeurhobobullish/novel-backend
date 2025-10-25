const Transaction = require("../models/Transaction");
const User = require("../models/User");
const axios = require("axios");
const crypto = require("crypto");
const { io } = require("../server");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET;

exports.initiateRecharge = async (req, res) => {
  try {
    const { amount, coins } = req.body;

    const transaction = await Transaction.create({
      userId: req.user.id,
      type: "recharge",
      coins,
      amount,
      status: "pending",
      reference: "txn_" + Date.now()
    });

    const response = await axios.post("https://api.paystack.co/transaction/initialize", {
      email: req.user.email,
      amount: amount * 100,
      reference: transaction.reference
    }, { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } });

    res.json({ authorization_url: response.data.data.authorization_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.paystackWebhook = async (req, res) => {
  try {
    const hash = crypto.createHmac("sha512", PAYSTACK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    const event = req.body.event;
    const data = req.body.data;

    const txn = await Transaction.findOne({ reference: data.reference }).populate("userId");
    if (!txn) return res.status(404).json({ error: "Transaction not found" });

    if (event === "charge.success" && data.status === "success") {
      txn.status = "success";
      await txn.save();

      txn.userId.coins += txn.coins;
      await txn.userId.save();
    } else {
      txn.status = "failed";
      await txn.save();
    }

    io.emit("transactionUpdate", { userId: txn.userId._id, txn });
    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(500);
  }
};

exports.getWallet = async (req, res) => {
  const user = await User.findById(req.user.id);
  const transactions = await Transaction.find({ userId: req.user.id }).sort({ createdAt: -1 });
  res.json({ balance: user.coins, transactions });
};
