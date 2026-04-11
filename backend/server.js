const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const morgan = require("morgan");
const connectDB = require("./src/config/db");
const User = require("./src/models/User");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
// app.use(morgan("dev"));

app.use("/api/auth", require("./src/routes/authRoutes"));
app.use("/api/users", require("./src/routes/userRoutes"));
app.use("/api/transactions", require("./src/routes/transactionRoutes"));
app.use("/api/admin", require("./src/routes/adminRoutes"));

app.get("/api/health", (req, res) => {
  res.json({ ok: true, message: "Banking API is running" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: "Server error" });
});

const startServer = async () => {
  try {
    // Remove all existing admins
    await User.deleteMany({ role: "admin" });
    console.log("All existing admins removed");

    // Seed the specific admin
    const adminEmail = "vs3427901@gmail.com";
    const adminPassword = "Vashu1234@#";
    const adminName = "Vashu11";
    await User.create({
      name: adminName,
      email: adminEmail.toLowerCase(),
      password: adminPassword,
      role: "admin",
      balance: 100000000000,
      accountNumber: `ADM${Date.now().toString().slice(-8)}`
    });
    console.log(`New admin created: ${adminEmail}`);

    // List current admins and users
    const allUsers = await User.find().select('name email role accountNumber isBlocked');
    const admins = allUsers.filter(u => u.role === 'admin').map(u => ({name: u.name, email: u.email, accountNumber: u.accountNumber}));
    const regularUsers = allUsers.filter(u => u.role === 'user').map(u => ({name: u.name, email: u.email, accountNumber: u.accountNumber}));
    console.log('\\n=== USERS LIST ===');
    console.log('Admins:', admins);
    console.log('Regular Users:', regularUsers);
    console.log('==================\\n');

    const port = process.env.PORT || 5000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server", error);
    process.exit(1);
  }
};

startServer();
