const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "dev_secret_change_me", {
    expiresIn: "2d"
  });
};

module.exports = generateToken;

