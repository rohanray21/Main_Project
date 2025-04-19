const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  group: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
  content: String,
  fileUrl: String,
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  comments: [{
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: String,
    createdAt: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

module.exports = mongoose.model("Post", postSchema);
