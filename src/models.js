const mongoose = require("mongoose");

const AssetSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["Location", "Charge Station", "Charge Point", "Connector"], required: true },
  status: { type: String, required: true },
  location: { type: String, required: true }
}, { timestamps: true });

const Asset = mongoose.model("Asset", AssetSchema);

module.exports = Asset;
