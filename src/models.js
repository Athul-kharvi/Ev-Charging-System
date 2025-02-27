const mongoose = require("mongoose");

// Location Schema (One Location -> Many Charge Stations)
const LocationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
  },
  { timestamps: true }
);

const Location = mongoose.model("Location", LocationSchema);

// Charge Station Schema (One Charge Station -> Many Charge Points)
const ChargeStationSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: mongoose.Schema.Types.ObjectId, ref: "Location", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const ChargeStation = mongoose.model("ChargeStation", ChargeStationSchema);

// Charge Point Schema (One Charge Point -> Many Connectors)
const ChargePointSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    chargeStation: { type: mongoose.Schema.Types.ObjectId, ref: "ChargeStation", required: true },
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const ChargePoint = mongoose.model("ChargePoint", ChargePointSchema);

// Connector Schema (One Connector belongs to One Charge Point)
const ConnectorSchema = new mongoose.Schema(
  {
    type: { type: String, required: true },
    chargePoint: { type: mongoose.Schema.Types.ObjectId, ref: "ChargePoint", required: true },
    powerOutput: { type: Number, required: true }, // Power output in kW
    status: { type: String, required: true },
  },
  { timestamps: true }
);

const Connector = mongoose.model("Connector", ConnectorSchema);

module.exports = { Location, ChargeStation, ChargePoint, Connector };
