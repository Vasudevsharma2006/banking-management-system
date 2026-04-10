const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ["credit", "debit", "transfer"],
      default: "transfer"
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    amount: {
      type: Number,
      required: true,
      min: 1
    },
    note: {
      type: String,
      trim: true,
      maxlength: 140
    },
    status: {
      type: String,
      enum: ["success", "failed"],
      default: "success"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Transaction", transactionSchema);

