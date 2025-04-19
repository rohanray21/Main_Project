import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, passwordHash });
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.json({ user, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const sendFriendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;
  try {
    const toUser = await User.findById(toUserId);
    if (!toUser) return res.status(404).json({ message: 'User not found' });

    if (toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ message: 'Friend request already sent' });
    }

    toUser.friendRequests.push(fromUserId);
    await toUser.save();
    res.status(200).json({ message: 'Friend request sent' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const acceptFriendRequest = async (req, res) => {
  const { fromUserId, toUserId } = req.body;
  try {
    const fromUser = await User.findById(fromUserId);
    const toUser = await User.findById(toUserId);

    if (!fromUser || !toUser) return res.status(404).json({ message: 'User not found' });

    fromUser.friends.push(toUserId);
    toUser.friends.push(fromUserId);

    toUser.friendRequests = toUser.friendRequests.filter(
      (id) => id.toString() !== fromUserId
    );

    await fromUser.save();
    await toUser.save();

    res.status(200).json({ message: 'Friend request accepted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const rejectFriendRequest = async (req, res) => {
    const { fromUserId, toUserId } = req.body;
    try {
      const toUser = await User.findById(toUserId);
      if (!toUser) return res.status(404).json({ message: 'User not found' });
  
      toUser.friendRequests = toUser.friendRequests.filter(
        (id) => id.toString() !== fromUserId
      );
  
      await toUser.save();
      res.status(200).json({ message: 'Friend request rejected' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  };