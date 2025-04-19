const mongoose = require("mongoose");

const groupSchema = new mongoose.Schema({
  name: String,
  description: String,
  isPrivate: { type: Boolean, default: false },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  admins: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Group", groupSchema);
