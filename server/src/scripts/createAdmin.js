require("dotenv").config();

const connectDB = require("../../config/db");
const User = require("../models/User");
const { USER_ROLE } = require("../constants/userRole");

async function createAdmin() {
  const name = process.env.ADMIN_NAME?.trim();
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD?.trim();

  if (!name || !email || !password) {
    throw new Error("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD must be set");
  }

  await connectDB();

  const existingAdmin = await User.findOne({ email });

  if (existingAdmin) {
    existingAdmin.name = name;
    existingAdmin.role = USER_ROLE.ADMIN;

    if (password) {
      existingAdmin.password = password;
    }

    await existingAdmin.save();
    console.log(`Admin account updated for ${email}`);
    process.exit(0);
  }

  await User.create({
    name,
    email,
    password,
    role: USER_ROLE.ADMIN
  });

  console.log(`Admin account created for ${email}`);
  process.exit(0);
}

createAdmin().catch((error) => {
  console.error(error.message || "Failed to create admin account");
  process.exit(1);
});
