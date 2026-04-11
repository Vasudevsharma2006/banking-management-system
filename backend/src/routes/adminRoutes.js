const express = require("express");
const { protect, adminOnly } = require("../middleware/authMiddleware");
const User = require("../models/User");
const Transaction = require("../models/Transaction");

const router = express.Router();

router.get("/users", protect, adminOnly, async (req, res) => {
  const users = await User.find().select("-password").sort({ createdAt: -1 });
  return res.json({ users });
});

router.patch("/users/:id/toggle-block", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.role === "admin") return res.status(400).json({ message: "Cannot block admin" });

    user.isBlocked = !user.isBlocked;
    await user.save();
    return res.json({ message: `User ${user.isBlocked ? "blocked" : "unblocked"}`, user });
  } catch (error) {
    return res.status(500).json({ message: "Could not update user status" });
  }
});

router.delete("/users/clear-regular", protect, adminOnly, async (req, res) => {
  try {
    const result = await User.deleteMany({ role: "user" });
    return res.json({ message: `Deleted ${result.deletedCount} regular users. Only admins remain.` });
  } catch (error) {
    return res.status(500).json({ message: "Failed to clear users" });
  }
});

router.get("/transactions", protect, adminOnly, async (req, res) => {
  const transactions = await Transaction.find()
    .populate("sender", "name accountNumber")
    .populate("recipient", "name accountNumber")
    .sort({ createdAt: -1 });
  return res.json({ transactions });
});

module.exports = router;

