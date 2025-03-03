require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");




const app = express();

const isCI = process.env.CI === "true";
const MONGO_URI = isCI
  ? "mongodb://127.0.0.1:27017/test"
  : "mongodb://127.0.0.1:27017/mongosh?directConnection=true&serverSelectionTimeoutMS=2000";

// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  // .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const assetRoutes = require("./src/routes");
app.use("/api/assets", assetRoutes);


app.get("/api/pingdb", (req, res) => {
  const isConnected = mongoose.connection.readyState === 1; // 1 means connected
  if (isConnected) {
    res.status(200).json({ message: "✅ MongoDB Connected" });
  } 
  // else {
  //   res.status(500).json({ message: "❌ MongoDB Not Connected" });
  // }
});

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the EV Charging System API!" });
});


// Start Server
const server = app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

module.exports = { app, server };
