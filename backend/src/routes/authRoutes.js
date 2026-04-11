const express = require("express");
const { body, validationResult } = require("express-validator");
const User = require("../models/User");
const generateToken = require("../utils/token");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const registerValidation = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters")
    .matches(/[A-Z]/)
    .withMessage("Password must include one uppercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must include one number")
];

router.post("/register", registerValidation, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, password } = req.body;
    const normalizedEmail = email.toLowerCase();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const accountNumber = `ACC${Math.floor(10000000 + Math.random() * 90000000)}`;
    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      accountNumber
    });

    return res.status(201).json({
      token: generateToken(user._id),
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        accountNumber: user.accountNumber,
        balance: user.balance
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Registration failed" });
  }
});

router.post(
  "/login",
  [body("email").isEmail().withMessage("Valid email required"), body("password").notEmpty()],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
    const { email, password } = req.body;
      const loginEmail = email.toLowerCase();
      console.log(`Login attempt for: ${loginEmail}`);
      const user = await User.findOne({ email: loginEmail });
      if (!user) {
        console.log(`User not found: ${loginEmail}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      const passwordMatch = await user.matchPassword(password);
      if (!passwordMatch) {
        console.log(`Password mismatch for: ${loginEmail}`);
        return res.status(401).json({ message: "Invalid credentials" });
      }
      if (user.isBlocked) {
        return res.status(403).json({ message: "Account blocked. Contact admin." });
      }

      return res.json({
        token: generateToken(user._id),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          accountNumber: user.accountNumber,
          balance: user.balance
        }
      });
    } catch (error) {
      return res.status(500).json({ message: "Login failed" });
    }
  }
);

router.get("/me", protect, async (req, res) => {
  return res.json({ user: req.user });
});

module.exports = router;

