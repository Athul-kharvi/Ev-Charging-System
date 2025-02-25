require("dotenv").config(); // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
// const assetRoutes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;
// const MONGO_URI = process.env.MONGO_URI;
const MONGO_URI = "mongodb://127.0.0.1:27017/mongosh?directConnection=true&serverSelectionTimeoutMS=2000"; // Replace with your MongoDB URI


// Middleware
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
const assetRoutes = require("./routes");
app.use("/api/assets", assetRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("Welcome to the EV Charging System API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


module.exports = app;
