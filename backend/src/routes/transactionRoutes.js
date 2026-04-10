const express = require("express");
const { body, validationResult } = require("express-validator");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.post(
  "/transfer",
  protect,
  [
    body("recipientAccountNumber")
      .trim()
      .isLength({ min: 5 })
      .withMessage("Recipient account number is required"),
    body("amount").isFloat({ gt: 0 }).withMessage("Amount must be greater than 0"),
    body("note").optional().trim().isLength({ max: 140 }).withMessage("Note too long")
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

    try {
      const { recipientAccountNumber, amount, note } = req.body;
      const numericAmount = Number(amount);

      // Load both parties before changing balances.
      const sender = await User.findById(req.user._id);
      const recipient = await User.findOne({ accountNumber: recipientAccountNumber });

      if (!recipient) {
        return res.status(404).json({ message: "Recipient not found" });
      }
      if (sender._id.toString() === recipient._id.toString()) {
        return res.status(400).json({ message: "Cannot transfer to your own account" });
      }
      if (sender.balance < numericAmount) {
        return res.status(400).json({ message: "Insufficient balance" });
      }
      if (recipient.isBlocked) {
        return res.status(400).json({ message: "Recipient account is blocked" });
      }

      // Update balances and then persist a transfer record.
      sender.balance -= numericAmount;
      recipient.balance += numericAmount;
      await sender.save();
      await recipient.save();

      const transaction = await Transaction.create({
        sender: sender._id,
        recipient: recipient._id,
        amount: numericAmount,
        note: note || "",
        type: "transfer",
        status: "success"
      });

      return res.status(201).json({
        message: "Transfer successful",
        transaction,
        updatedBalance: sender.balance
      });
    } catch (error) {
      return res.status(500).json({ message: "Transfer failed" });
    }
  }
);

router.get("/me", protect, async (req, res) => {
  try {
    const transactions = await Transaction.find({
      $or: [{ sender: req.user._id }, { recipient: req.user._id }]
    })
      .populate("sender", "name accountNumber")
      .populate("recipient", "name accountNumber")
      .sort({ createdAt: -1 });

    return res.json({ transactions });
  } catch (error) {
    return res.status(500).json({ message: "Could not fetch transactions" });
  }
});

module.exports = router;
