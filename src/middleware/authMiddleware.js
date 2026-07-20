const jwt = require("jsonwebtoken");

const User = require("../models/User");
const { USER_ROLE } = require("../constants/userRole");
const asyncHandler = require("../utils/asyncHandler");

const protect = asyncHandler(async (req, res, next) => {
  const authorizationHeader = req.headers.authorization || "";

  if (!authorizationHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token is required");
  }

  const token = authorizationHeader.split(" ")[1];

  if (!process.env.JWT_SECRET) {
    res.status(500);
    throw new Error("JWT_SECRET is not configured");
  }

  let decodedToken;

  try {
    decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    res.status(401);
    throw new Error("Invalid or expired token");
  }

  const userId = decodedToken.id || decodedToken._id;

  if (!userId) {
    res.status(401);
    throw new Error("Token payload is invalid");
  }

  const user = await User.findById(userId).select("name email role");

  if (!user) {
    res.status(401);
    throw new Error("User associated with this token no longer exists");
  }

  req.user = {
    _id: user._id,
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role
  };

  next();
});

const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Authentication is required"
      });
    }

    if (!req.user.role || !roles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access denied"
      });
    }

    next();
  };
};

const adminOnly = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      message: "Authentication is required"
    });
  }

  if (req.user.role !== USER_ROLE.ADMIN) {
    return res.status(403).json({
      success: false,
      message: "Access denied"
    });
  }

  next();
};

module.exports = {
  protect,
  authorizeRoles,
  adminOnly
};
