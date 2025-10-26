const axios = require("axios");
const User = require("../models/User");

const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET; // put your secret key in .env

// 1. Initialize payment
exports.initializePayment = async (req, res) => {
  try {
    const { amount } = req.body; // amount in Naira
    const user = req.user;

    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email: user.email,
        amount: amount * 100, // Paystack uses kobo
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    res.json(response.data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 2. Verify payment
exports.verifyPayment = async (req, res) => {
  try {
    const { reference } = req.params;
    const response = await axios.get(
      `https://api.paystack.co/transaction/verify/${reference}`,
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );

    const data = response.data.data;

    if (data.status === "success") {
      // Add coins to user wallet (1 Naira = 1 coin example)
      const user = await User.findById(req.user._id);
      user.coins += data.amount / 100; // convert kobo back to naira
      await user.save();
      return res.json({ success: true, coins: user.coins });
    }

    res.json({ success: false, message: "Payment not successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
