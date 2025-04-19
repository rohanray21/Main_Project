const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  recipient: { type: mongoose.Schema.Types.ObjectId, refPath: "recipientModel" }, // User or Group
  recipientModel: { type: String, enum: ["User", "Group"] },
  text: String,
  fileUrl: String,
  seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
}, { timestamps: true });

module.exports = mongoose.model("Message", messageSchema);
