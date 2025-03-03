const mongoose = require("mongoose");

// ✅ Base Schema to avoid duplication
const BaseSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    status: { type: String, required: true },
  },
  { timestamps: true },
);

// ✅ Location Schema (One Location -> Many Charge Stations)
const LocationSchema = new mongoose.Schema({
  ...BaseSchema.obj,
  address: { type: String, required: true },
});
const Location = mongoose.model("Location", LocationSchema);

// ✅ Charge Station Schema (One Charge Station -> Many Charge Points)
const ChargeStationSchema = new mongoose.Schema({
  ...BaseSchema.obj,
  location: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Location",
    required: true,
  },
});
const ChargeStation = mongoose.model("ChargeStation", ChargeStationSchema);

// ✅ Charge Point Schema (One Charge Point -> Many Connectors)
const ChargePointSchema = new mongoose.Schema({
  ...BaseSchema.obj,
  chargeStation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChargeStation",
  },
});
const ChargePoint = mongoose.model("ChargePoint", ChargePointSchema);

// ✅ Connector Schema (One Connector belongs to One Charge Point)
const ConnectorSchema = new mongoose.Schema({
  type: { type: String, required: true },
  chargePoint: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChargePoint",
    required: true,
  },
  powerOutput: { type: Number, required: true }, // Power output in kW
  status: { type: String, required: true },
});
const Connector = mongoose.model("Connector", ConnectorSchema);

module.exports = { Location, ChargeStation, ChargePoint, Connector };
