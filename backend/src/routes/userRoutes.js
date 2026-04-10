const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const User = require("../models/User");

const router = express.Router();

router.get("/profile", protect, async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  return res.json({ user });
});

module.exports = router;

