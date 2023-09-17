const User = require('../models/User');
const Note = require('../models/Note');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcrypt');

// @desc Get all Users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {});

// @desc Create new User
// @route POST /user
// @access Private
const createNewUser = asyncHandler(async (req, res) => {});

// @desc Update a user
// @route Patch /user
// @access Private
const updateUser = asyncHandler(async (req, res) => {});

// @desc Delete a user
// @route Delete /user
// @access Private
const deleteUser = asyncHandler(async (req, res) => {});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
