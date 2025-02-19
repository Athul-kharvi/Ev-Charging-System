const mongoose = require('mongoose');

const AssetSchema = new mongoose.Schema({
  name: String,
  type: String,  // Location, Charge Station, Charge Point, Connector
  status: String,
  location: String
}, { timestamps: true });

module.exports = mongoose.model('Asset', AssetSchema);
