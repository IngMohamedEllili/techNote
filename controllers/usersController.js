const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');
/*
@desc Get all Users
@route GET /users
@access Private
*/
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('-password').lean();
  if (!users?.length) {
    return res.status(400).json({ message: 'No Users Found' });
  }
  res.json(users);
});

// @desc Create new User
// @route POST /user
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;
  // Confirm Data
  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: 'All field are required' });
  }

  // Check for duplicate
  const duplicate = await User.findOne({ username }).lean().exec();
  if (duplicate) {
    return res.status(409).json({ message: 'Duplicate UserName' });
  }

  // Hash pasword
  const hashedPassword = await bcrypt.hash(password, 10); // salt rounds
  const userObject = { username, password: hashedPassword, roles };

  // Create User
  const newUser = await User.create(userObject);
  if (newUser) {
    res.status(200).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: 'Invalid User data received' });
  }
});

// @desc Update a user
// @route Patch /user
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, roles, active, password } = req.body;
  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== 'boolean'
  ) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const user = await User.findById(id.toString()).exec();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const duplicate = await User.findOne({ username }).lean().exec();
  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: 'Duplicate username' });
  }
  user.username = username;
  user.roles = roles;
  user.active = active;
  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }
  const updatdeUser = await user.save();
  res.status(200).json({ message: `${username} updated` });
});

// @desc Delete a user
// @route Delete /user
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;
  if (!id) {
    res.status(400).json({ message: 'User ID required' });
  }
  const notes = await Note.findOne({ user: id }).lean().exec();
  if (notes?.length) {
    return res.status(400).json({ message: 'User has assigned Notes' });
  }
  const user = await User.findById(id).exec();
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  const result = await user.deleteOne();
  const reply = `Username ${result.username} with ID ${result._id} deleted`;
  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
