const express = require("express");
const router = express.Router();
const FriendRequest = require("../models/FriendRequest");
const User = require("../models/User");

// Send friend request
router.post("/send", async (req, res) => {
  const { fromUserId, toUserId } = req.body;

  if (fromUserId === toUserId) return res.status(400).json({ msg: "You cannot send request to yourself" });

  try {
    // Check if request already exists
    const existing = await FriendRequest.findOne({ from: fromUserId, to: toUserId, status: "pending" });
    if (existing) return res.status(400).json({ msg: "Request already sent" });

    const newRequest = await FriendRequest.create({ from: fromUserId, to: toUserId });
    res.json(newRequest);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Accept friend request
router.post("/accept", async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request || request.status !== "pending") return res.status(404).json({ msg: "Request not found" });

    request.status = "accepted";
    await request.save();

    // Add each other as friends
    await User.findByIdAndUpdate(request.from, { $addToSet: { friends: request.to } });
    await User.findByIdAndUpdate(request.to, { $addToSet: { friends: request.from } });

    res.json({ msg: "Friend request accepted", request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Reject/Delete friend request
router.post("/reject", async (req, res) => {
  const { requestId } = req.body;

  try {
    const request = await FriendRequest.findById(requestId);
    if (!request) return res.status(404).json({ msg: "Request not found" });

    request.status = "declined";
    await request.save();

    res.json({ msg: "Friend request declined", request });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

// Get incoming requests for a user
router.get("/received/:userId", async (req, res) => {
  try {
    const requests = await FriendRequest.find({ to: req.params.userId, status: "pending" })
      .populate("from", "name email avatar");
    res.json(requests);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
