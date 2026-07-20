require("dotenv").config();

const mongoose = require("mongoose");

const connectDB = require("../config/db");
const app = require("./app");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.error("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  console.error("MongoDB error:", error.message);
});

startServer();
