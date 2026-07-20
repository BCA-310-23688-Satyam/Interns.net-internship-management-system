const mongoose = require("mongoose");

const APPROVAL_STATUS = ["pending", "approved", "rejected"];

const internshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
      trim: true
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true
    },
    duration: {
      type: String,
      required: [true, "Duration is required"],
      default: "",
      trim: true
    },
    requiredSkills: {
      type: String,
      required: [true, "Required skills are required"],
      default: "",
      trim: true
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    approvalStatus: {
      type: String,
      enum: APPROVAL_STATUS,
      default: "approved"
    },
    applicants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application"
      }
    ]
  },
  {
    timestamps: true
  }
);

internshipSchema.index({ company: 1, createdAt: -1 });
internshipSchema.index({ title: "text" });

module.exports = mongoose.model("Internship", internshipSchema);
