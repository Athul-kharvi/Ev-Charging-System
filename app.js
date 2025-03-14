require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");

const app = express();

const MONGO_URI =
  "mongodb://127.0.0.1:27017/mongosh?directConnection=true&serverSelectionTimeoutMS=2000";

// Middleware
app.use(express.json());

// Routes
const assetRoutes = require("./src/routes");
app.use("/api/assets", assetRoutes);

const getMongoDBStatus = () => mongoose.connection.readyState === 1;

// API Route to check DB connection
app.get("/api/pingdb", (req, res) => {
  if (getMongoDBStatus()) {
    res.status(200).json({ message: "✅ MongoDB Connected" });
  } else {
    res.status(500).json({ message: "❌ MongoDB Not Connected" });
  }
});

// Connect to MongoDB
mongoose.connect(MONGO_URI).then(() => console.log("✅ MongoDB Connected"));

// Root Route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the EV Charging System API!" });
});

// Start Server
const server = app.listen(3000, () => {
  console.log("🚀 Server running at http://localhost:3000");
});

module.exports = { app, server };
