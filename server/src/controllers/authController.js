const User = require("../models/User");
const { USER_ROLE } = require("../constants/userRole");
const asyncHandler = require("../utils/asyncHandler");
const generateToken = require("../utils/generateToken");
const { sendRegistrationEmail } = require("../utils/emailService");

const formatAuthResponse = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!name?.trim() || !normalizedEmail || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }

  const normalizedRole = role || USER_ROLE.STUDENT;
  const allowedRegistrationRoles = [USER_ROLE.STUDENT, USER_ROLE.COMPANY];

  if (!allowedRegistrationRoles.includes(normalizedRole)) {
    return res.status(400).json({ message: "Invalid role provided" });
  }

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    return res.status(400).json({ message: "Email already in use" });
  }

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    password,
    role: normalizedRole
  });

  try {
    await sendRegistrationEmail(user.email);
    console.log(`Registration welcome email sent to ${user.email}`);
  } catch (error) {
    console.error(`Failed to send registration welcome email to ${user.email}:`, error.message);
  }

  res.status(201).json({
    message: "User registered successfully",
    user: formatAuthResponse(user),
    token: generateToken({ id: user._id, role: user.role })
  });
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  res.status(200).json({
    message: "User logged in successfully",
    user: formatAuthResponse(user),
    token: generateToken({ id: user._id, role: user.role })
  });
});

exports.loginAdmin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const normalizedEmail = email?.trim().toLowerCase();

  if (!normalizedEmail || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: normalizedEmail }).select("+password");

  if (!user || user.role !== USER_ROLE.ADMIN) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid admin credentials" });
  }

  res.status(200).json({
    message: "Admin logged in successfully",
    user: formatAuthResponse(user),
    token: generateToken({ id: user._id, role: user.role })
  });
});

exports.getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("name email role");

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  res.json({
    message: "Current user data",
    user: formatAuthResponse(user)
  });
});

exports.getStudentDashboard = (req, res) => {
  res.json({
    message: "Student dashboard data"
  });
};

exports.getCompanyDashboard = (req, res) => {
  res.json({
    message: "Company dashboard data"
  });
};
