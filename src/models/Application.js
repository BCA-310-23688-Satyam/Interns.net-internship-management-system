const mongoose = require("mongoose");

const { APPLICATION_STATUS } = require("../constants/applicationStatus");

const applicationSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    internship: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Internship",
      required: true
    },
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true
    },
    currentCourse: {
      type: String,
      required: [true, "Current course is required"],
      trim: true
    },
    desiredRole: {
      type: String,
      required: [true, "Desired role is required"],
      trim: true
    },
    studentIdCard: {
      type: String,
      required: [true, "Student ID card is required"],
      trim: true
    },
    status: {
      type: String,
      enum: Object.values(APPLICATION_STATUS),
      default: APPLICATION_STATUS.APPLIED
    }
  },
  {
    timestamps: true
  }
);

applicationSchema.index({ student: 1, internship: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
